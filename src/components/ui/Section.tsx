import { chapterIndex, type ChapterId } from "@/content/chapters";
import { Reveal } from "./Reveal";

type Props = {
  id: ChapterId;
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/** Standard chapter wrapper: numbered kicker, display headline and optional lede. */
export function Section({ id, kicker, title, lede, children, className = "" }: Props) {
  const n = String(chapterIndex(id)).padStart(2, "0");
  return (
    <section
      id={id}
      data-chapter={id}
      className={`relative px-5 py-28 sm:px-8 md:py-40 md:pl-28 lg:pr-16 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-water uppercase">
            <span className="tabular-nums">{n}</span>
            <span className="h-px w-10 bg-water/50" />
            {kicker}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {title}
          </h2>
        </Reveal>
        {lede && (
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{lede}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** Body paragraph styling shared by chapters. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl space-y-5 text-base leading-relaxed text-muted md:text-lg ${className}`}>{children}</div>
  );
}
