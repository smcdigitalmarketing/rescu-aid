/**
 * Assembles each video ad with ffmpeg: trims its Veo clips, lays the exported
 * caption PNGs over them on schedule, appends the end card and writes
 * app/assets/ads/<video>.mp4 plus a poster frame.
 *
 *   npm run videos:build            # needs ffmpeg, Veo clips and `npm run ads:export`
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { videoAds, videoDuration } from "../app/data/ads.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "app/assets/ads");
const overlayDir = join(root, "assets/video/overlays");
mkdirSync(outDir, { recursive: true });

const FPS = 24;
const clipFile = (id: string) =>
  ["final", "draft"]
    .map((t) => join(root, "assets/video", t, `${id}.mp4`))
    .find(existsSync);

const hasAudio = (file: string) =>
  execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "a",
    "-show_entries",
    "stream=index",
    "-of",
    "csv=p=0",
    file,
  ])
    .toString()
    .trim().length > 0;

let built = 0;
for (const video of videoAds) {
  const clips = video.segments.map((s) => clipFile(s.clip));
  const overlayFiles = video.overlays.map((o) =>
    join(overlayDir, `${video.id}.${o.id}.png`),
  );
  const endFile = join(overlayDir, `${video.id}.end.png`);
  const missing = [
    ...video.segments
      .filter((_, i) => !clips[i])
      .map((s) => `clip ${s.clip} (npm run videos)`),
    ...[...overlayFiles, endFile]
      .filter((f) => !existsSync(f))
      .map((f) => `${f.replace(root + "/", "")} (npm run ads:export)`),
  ];
  if (missing.length) {
    console.log(`– ${video.id}: skipped, missing ${missing.join(", ")}`);
    continue;
  }

  const inputs: string[] = [];
  const filters: string[] = [];
  const concat: string[] = [];
  let n = 0;
  const overlayInput = new Map<string, number>();

  video.segments.forEach((seg, i) => {
    const file = clips[i]!;
    const [a, b] = seg.trim;
    const vIn = n++;
    inputs.push("-i", file);
    filters.push(
      `[${vIn}:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,scale=1080:1920,fps=${FPS},setsar=1,format=yuv420p[s${i}v0]`,
    );
    if (hasAudio(file)) {
      filters.push(
        `[${vIn}:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS,aresample=48000[s${i}a]`,
      );
    } else {
      const silent = n++;
      inputs.push(
        "-f",
        "lavfi",
        "-t",
        String(b - a),
        "-i",
        "anullsrc=r=48000:cl=stereo",
      );
      filters.push(`[${silent}:a]anull[s${i}a]`);
    }
    let last = `s${i}v0`;
    seg.overlays.forEach((o, j) => {
      if (!overlayInput.has(o.overlay)) {
        overlayInput.set(o.overlay, n++);
        inputs.push("-i", join(overlayDir, `${video.id}.${o.overlay}.png`));
      }
      const next = `s${i}v${j + 1}`;
      filters.push(
        `[${last}][${overlayInput.get(o.overlay)}:v]overlay=0:0:enable='between(t,${o.from},${o.to})'[${next}]`,
      );
      last = next;
    });
    concat.push(`[${last}][s${i}a]`);
  });

  const endIn = n++;
  inputs.push("-loop", "1", "-t", String(video.endCard), "-i", endFile);
  filters.push(
    `[${endIn}:v]scale=1080:1920,fps=${FPS},setsar=1,format=yuv420p[endv]`,
  );
  const endAudio = n++;
  inputs.push(
    "-f",
    "lavfi",
    "-t",
    String(video.endCard),
    "-i",
    "anullsrc=r=48000:cl=stereo",
  );
  filters.push(`[${endAudio}:a]anull[enda]`);
  concat.push("[endv][enda]");
  filters.push(`${concat.join("")}concat=n=${concat.length}:v=1:a=1[v][a]`);
  // Veo ambience at a gentle level so captions and platform music can sit on top.
  filters.push(
    `[a]volume=0.7,afade=t=out:st=${(videoDuration(video) - 0.6).toFixed(2)}:d=0.6[aout]`,
  );

  const out = join(outDir, `${video.id}.mp4`);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      ...inputs,
      "-filter_complex",
      filters.join(";"),
      "-map",
      "[v]",
      "-map",
      "[aout]",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      out,
    ],
    { stdio: "inherit" },
  );
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    "1.5",
    "-i",
    out,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    out.replace(/\.mp4$/, ".jpg"),
  ]);
  const takes = video.segments
    .map(
      (s, i) =>
        `${s.clip}:${clips[i]!.includes("/final/") ? "final" : "draft"}`,
    )
    .join(", ");
  console.log(
    `✓ ${video.id}.mp4 (${videoDuration(video).toFixed(1)}s; ${takes})`,
  );
  built++;
}
console.log(
  built
    ? "Done. Review each video on /ads before uploading."
    : "Nothing built.",
);
