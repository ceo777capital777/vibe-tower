import { getHubSections } from "@/content/sections";
import { Reveal } from "@/components/ui/Reveal";
import { SectionCard } from "./SectionCard";

/** Директория башни: 7 разделов в архитектурной сетке */
const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-5",
  "md:col-span-2 lg:col-span-7",
];

export function HubGrid() {
  const sections = getHubSections();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
      {sections.map((s, i) => (
        <Reveal key={s.id} delay={(i % 3) * 0.06} className={spans[i]}>
          <SectionCard section={s} index={i} size={i === 0 || i === 6 ? "lg" : "md"} />
        </Reveal>
      ))}
    </div>
  );
}
