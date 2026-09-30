import type { ComponentType } from "react";
import {
  ArrowRight,
  Backpack,
  BedDouble,
  Car,
  House,
  Utensils,
  UsersRound,
} from "lucide-react";
import { money, bundlePrice, type Bundle } from "~/data/product";
import { img, type ResolvedImage } from "~/lib/images";
import type { SlotId } from "~/data/image-slots";
import { Picture } from "./media";
import { SOURCES, Sources } from "./content";

/** The time gap between a choking emergency and professional help. */
export function Timeline() {
  const points = [
    {
      time: "0:00",
      title: "Call 911. Start back blows and abdominal thrusts.",
      body: "The recognized first steps, for every choking emergency.",
    },
    {
      time: "< 5 min",
      title: "Brain cells begin to die",
      body: "Some brain cells start dying less than 5 minutes after oxygen is cut off.",
    },
    {
      time: "~7 min",
      title: "Typical ambulance arrival",
      body: "The US median from 911 call to EMS arrival. In rural areas it's about 13 minutes.",
    },
  ];
  return (
    <>
      <ol className="relative grid gap-5 md:grid-cols-3">
        {points.map((p, i) => (
          <li
            key={p.time}
            className="relative rounded-card bg-surface p-6 shadow-sm"
          >
            <p
              className={`font-display text-4xl font-semibold ${i === 0 ? "text-ink" : "text-brand"}`}
            >
              {p.time}
            </p>
            <h3 className="mt-3 font-semibold">{p.title}</h3>
            <p className="mt-1 text-muted">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-8 max-w-2xl text-center font-display text-2xl font-medium text-balance">
        If back blows and thrusts aren't working, the gap between minute one and
        the ambulance is yours to fill.
      </p>
      <Sources items={[SOURCES.hypoxia, SOURCES.ems]} />
    </>
  );
}

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true";
}>;

export function RiskGroups({
  items,
}: {
  items: { icon: Icon; title: string; body: string }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="rounded-card border border-line bg-surface p-6"
        >
          <span className="grid size-12 place-items-center rounded-full bg-highlight text-accent">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
          <p className="mt-1 text-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}

const ROOMS: { title: string; body: string; icon: Icon }[] = [
  { title: "Kitchen", body: "Where most meals start.", icon: Utensils },
  { title: "Dining room", body: "Holidays and big family meals.", icon: UsersRound },
  { title: "Car", body: "Snacks on the go.", icon: Car },
  { title: "Bedside", body: "Pills and late-night water.", icon: BedDouble },
  { title: "Diaper bag", body: "Wherever the little one goes.", icon: Backpack },
  { title: "Grandparents' house", body: "Sunday dinners and sleepovers.", icon: House },
];

// Lifestyle photos appear only once generated; placeholders would repeat the demo shot.
const ROOM_PHOTOS: SlotId[] = ["v2Grandparent", "v2Car", "v2Nightstand", "v2Diaperbag"];

/** Where to keep a kit. Ends with a bundle nudge that selects the bundle and jumps to #buy. */
export function RoomMap({ bundle, onChoose }: { bundle: Bundle; onChoose: (id: string) => void }) {
  const photos = ROOM_PHOTOS.map(img).filter((x) => x?.generated) as ResolvedImage[];
  return (
    <>
      {photos.length >= 2 && (
        <ul className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {photos.map((photo) => (
            <li key={photo.src} className="aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
              <Picture image={photo} />
            </li>
          ))}
        </ul>
      )}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {ROOMS.map(({ title, body, icon: Icon }) => (
          <li key={title} className="flex flex-col items-start gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold leading-snug">{title}</span>
              <span className="text-sm text-muted">{body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <a
          href="#buy"
          onClick={() => onChoose(bundle.id)}
          className="inline-flex items-center gap-2 rounded-btn bg-brand px-7 py-4 text-lg font-bold text-brand-ink transition hover:bg-brand-strong"
        >
          Cover {bundle.kits} spots for {money(bundlePrice(bundle))}
          <ArrowRight className="size-5" aria-hidden="true" />
        </a>
        <p className="text-sm text-muted">Buy 2, get the 3rd kit free.</p>
      </div>
    </>
  );
}
