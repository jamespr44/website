import Link from "next/link";
import { IridescentBackdrop } from "@/components/ui/IridescentBackdrop";
import { LiquidText } from "@/components/ui/LiquidText";
import { Reveal } from "@/components/ui/Reveal";
import { profile, projects } from "@/content/profile";

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 grid h-[66px] grid-cols-[1fr_auto] items-center px-4 text-white mix-blend-difference sm:px-8 md:grid-cols-3">
        <Link href="/" className="justify-self-start text-[15px] transition-opacity duration-300 hover:opacity-60">
          {profile.name}
        </Link>
        <span className="t-label hidden justify-self-center md:block">Portfolio</span>
        <a
          href={profile.contact.length ? "#contact" : "#projects"}
          className="pill pill-sm justify-self-end border-white/40 text-white hover:bg-white hover:text-black"
        >
          {profile.contact.length ? "Contact" : "Projects"}
        </a>
      </header>

      <main>
        <section className="px-4 pt-[132px] pb-24 sm:px-8 md:pt-[180px] md:pb-32">
          <div className="mx-auto max-w-[1078px]">
            <h1 className="t-display m-0 !text-[clamp(56px,11vw,160px)]">
              <LiquidText block zoom={1.3}>
                {profile.name}
              </LiquidText>
            </h1>
            <div className="mt-14 grid gap-10 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
              <p className="t-label m-0 md:mt-2">{profile.role}</p>
              <div className="max-w-[640px] space-y-5 text-lg leading-[1.58] text-inkstone">
                {profile.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="border-t border-line px-4 py-24 sm:px-8 md:py-32">
          <div className="mx-auto max-w-[1078px]">
            <p className="t-label m-0">Projects</p>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {projects.map((p) => (
                <Reveal key={p.slug}>
                  <Link href={p.href} className="group panel flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <IridescentBackdrop />
                      <p className="t-sub absolute inset-x-0 bottom-0 m-0 p-6 text-white md:p-8">{p.title}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <p className="t-label m-0 text-muted">
                        {p.kind} · {p.year}
                      </p>
                      <p className="mt-4 mb-0 leading-[1.55] text-inkstone">{p.summary}</p>
                      <ul className="m-0 mt-6 flex flex-wrap gap-2 p-0">
                        {p.tags.map((t) => (
                          <li
                            key={t}
                            className="t-caption list-none rounded-[75px] border border-line px-3 py-1 text-muted"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                      <span className="pill pill-sm mt-8 self-start group-hover:bg-ink group-hover:text-bg">
                        Read the proposal
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-line px-4 pt-10 pb-12 sm:px-8">
        <div className="mx-auto grid max-w-[1078px] gap-8 md:grid-cols-3">
          <div className="t-caption space-y-2 text-muted">
            <p className="m-0 text-ink">{profile.name}</p>
            <p className="m-0">{profile.role}</p>
          </div>
          <ul className="m-0 flex flex-wrap gap-3 p-0 md:col-span-2 md:justify-self-end">
            {profile.contact.map((c) => (
              <li key={c.href} className="list-none">
                <a href={c.href} className="pill pill-sm">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
