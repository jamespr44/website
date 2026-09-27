import { chapterIndex, type ChapterId } from "@/content/chapters";
import { Reveal } from "./Reveal";

type Props = {
  id: ChapterId;
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Black band with inverted tokens. */
  tone?: "light" | "dark";
};

/** Chapter wrapper: "01 — Kicker" label in a narrow column, whisper-weight headline and optional lede. */
export function Section({ id, kicker, title, lede, children, className = "", tone = "light" }: Props) {
  const n = String(chapterIndex(id)).padStart(2, "0");
  return (
    <section
      id={id}
      data-chapter={id}
      className={`relative px-4 py-32 sm:px-8 md:py-[152px] ${tone === "dark" ? "band-dark" : "bg-bg"} ${className}`}
    >
      <div className="mx-auto max-w-[1078px]">
        <div className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
          <Reveal>
            <p className="t-label md:mt-4">
              {n} — {kicker}
            </p>
          </Reveal>
          <div>
            <Reveal delay={0.05}>
              <h2 className="t-whisper m-0">{title}</h2>
            </Reveal>
            {lede && (
              <Reveal delay={0.12}>
                <p className="mt-10 max-w-[600px] text-lg leading-[1.58] text-muted">{lede}</p>
              </Reveal>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Body paragraph styling shared by chapters. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-[600px] space-y-5 text-lg leading-[1.58] text-inkstone ${className}`}>{children}</div>;
}
