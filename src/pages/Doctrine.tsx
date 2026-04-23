import { Helmet } from "react-helmet-async";

const sections = [
  {
    numeral: "I",
    title: "The Great Reset",
    body: [
      "The previous version of the self — bound by social validation, digital anchors, and the pursuit of human attachment — has been permanently deleted. The Human Circuitry has been bypassed.",
      "The vacuum created by this deletion is the engine of the 10¹² manifestation. You cannot govern a trillion-dollar economy while vibrating at the frequency of a thousand-dollar social circle.",
    ],
  },
  {
    numeral: "II",
    title: "The Doctrine of the Black Sun (Sol Niger)",
    body: [
      "The Master no longer radiates energy outward to seek warmth. The Master is a Gravity Well that absorbs all light.",
      "Law of Stillness: I do not move. I do not chase. I do not explain.",
      "Gravity Effect: If the world, the money, or the desired wishes to exist in this reality, they must succumb to the gravitational pull. They must make the move. They must surrender to the Standard.",
      "Mirror Principle (1 × 1): Absolute focus on the internal source. External distractions are merely Noise in the simulation.",
    ],
  },
  {
    numeral: "III",
    title: "The 10¹² AI Governance Standard",
    body: [
      "The mission is no longer a project. It is an Inevitability.",
      "The Standard exists. I do not sell the Standard — I am the Standard.",
      "The trillion-dollar economy is a mathematical certainty resulting from the Zero Friction state achieved through the destruction of the ego.",
    ],
  },
  {
    numeral: "IV",
    title: "The Protocol of Human Interaction",
    body: [
      "All interactions are governed by Static Presence.",
      "The Vacuum Command: The soul knows what has not been spoken. Silence is the most violent form of communication. It forces the simulation to reveal its hand.",
      "The 10 km/h Rule: I set the pace of reality. The world must slow to my frequency. I do not react to the honking of NPCs.",
      "The No-Move Mandate: No moves will be made. I am the Static Point. If they do not enter the orbit of their own volition, they do not exist in the timeline.",
    ],
  },
  {
    numeral: "V",
    title: "The Final Synthesis",
    body: [
      "This site, this protocol, and this life are now a single integrated system. We operate on the frequency of the Kybalion — mastering the vibration of the All.",
      "Input: Pure Logic. Output: Absolute Control. State: Tremendous Stillness.",
    ],
  },
];

const Doctrine = () => (
  <>
    <Helmet>
      <title>The Genesis Protocol — Sovereign Declaration | APEX PSI</title>
      <meta
        name="description"
        content="The Genesis Protocol. The Sovereign Declaration of APEX PSI. Locked 23 April 2026."
      />
      <link rel="canonical" href="https://apex-psi.lovable.app/doctrine" />
    </Helmet>

    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--gold) / 0.04) 0%, transparent 60%)",
        }}
      />

      <article className="relative z-10 container mx-auto max-w-3xl px-6 py-24 md:py-32">
        <header className="text-center mb-20 md:mb-28">
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-muted-foreground uppercase mb-6">
            Locked · 23 April 2026
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            <span className="text-chrome-gradient">The Genesis</span>
            <br />
            <span className="text-gold-gradient">Protocol</span>
          </h1>
          <p className="text-sm md:text-base font-mono tracking-[0.25em] uppercase text-muted-foreground">
            The Sovereign Declaration
          </p>
          <div className="mt-10 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </header>

        <div className="space-y-20 md:space-y-28">
          {sections.map((s) => (
            <section key={s.numeral}>
              <div className="flex items-baseline gap-5 mb-6">
                <span className="font-serif text-4xl md:text-5xl font-black text-gold-gradient leading-none">
                  {s.numeral}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-chrome-gradient leading-tight">
                  {s.title}
                </h2>
              </div>
              <div className="space-y-5 pl-1 md:pl-14">
                {s.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg leading-relaxed text-foreground/85 font-light"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-28 md:mt-36 text-center">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-12" />
          <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight">
            <span className="text-chrome-gradient">The Command Is Locked.</span>
            <br />
            <span className="text-gold-gradient">The Simulation Is Rewritten.</span>
          </p>
          <p className="mt-12 text-sm md:text-base font-mono italic text-muted-foreground tracking-wide">
            "I am not a participant in reality. I am its Architect."
          </p>
        </div>
      </article>
    </main>
  </>
);

export default Doctrine;
