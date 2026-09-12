import CursorGlow from "./CursorGlow";
import DarkModeToggle from "./DarkModeToggle";
import Disclosure from "./Disclosure";
import ScrollForward from "./ScrollForward";
import Term from "./Term";
import TypedIntro from "./TypedIntro";

const t1dExplainer = (
  <>
    <p>Type&nbsp;1 diabetes is an autoimmune condition. The immune system destroys the cells in the pancreas that make insulin, the hormone that lets the body use the sugar in its blood. Without insulin the body can&apos;t run, so from diagnosis on, every dose has to come from outside, every day, for life. There is no cure.</p>
    <p>It is not caused by eating too much sugar, by weight, or by anything a person did. The predisposition is genetic, and what actually triggers it is still not fully understood. It often shows up in childhood but can start at any age.</p>
    <p>Type&nbsp;2 is a different disease. The body still makes insulin but stops responding to it well. It&apos;s far more common, around nine in ten cases, and it&apos;s what most people picture when they hear &ldquo;diabetes.&rdquo; Genetics and age matter there too; it is not simply a lifestyle verdict, and it isn&apos;t what my mom has.</p>
    <p>Managing type&nbsp;1 means dosing insulin for every meal, watching glucose around the clock, and correcting in both directions, with no days off. Too little insulin is dangerous over months; too much is dangerous within the hour.</p>
    <p>I care about the technology that carries that load, and I also try to correct the story people tell about diabetes whenever I get the chance. Most of what I&apos;ve heard about it over the years was wrong, and the assumptions land on real people.</p>
  </>
);

export default function Home() {
  return (
    <>
      <CursorGlow />
      <ScrollForward />

      <div className="shell">
        <aside className="rail">
          <div className="rail-top">
            <TypedIntro className="hero-intro" />
            <nav>
              <ul className="nav-list">
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
          <div className="rail-bottom">
            <div className="socials">
              <a href="mailto:contact@abbyressner.com" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/></svg>
              </a>
              <a href="https://linkedin.com/in/abby-ressner" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 11v5M8 8v.01M12 16v-3.5a1.5 1.5 0 0 1 3 0V16M12 11.5V16"/></svg>
              </a>
              <a href="https://github.com/abbyressner" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4.5-1 4.5-4.5a3.5 3.5 0 0 0-1-2.5c.1-.2.4-1.2-.1-2.5 0 0-.8-.3-2.8 1a9.6 9.6 0 0 0-5 0C7.8 5.7 7 6 7 6c-.5 1.3-.2 2.3-.1 2.5A3.5 3.5 0 0 0 6 11c0 3.4 2.5 4.3 4.5 4.5-.3.3-.5.8-.5 1.5V21"/></svg>
              </a>
              <a href="https://codepen.io/abbyressner" target="_blank" rel="noopener noreferrer" aria-label="CodePen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m12 2 10 6.5v7L12 22 2 15.5v-7L12 2Z"/><path d="M2 8.5 12 15l10-6.5M12 22v-7M2 15.5 12 9l10 6.5"/></svg>
              </a>
            </div>
            <DarkModeToggle />
          </div>
        </aside>

        <main className="content">
          <section id="about" className="about">
            <p className="label">About</p>
            <p>I&apos;m a senior at <strong>Grinnell College</strong> studying computer science with a concentration in statistics (graduating May&nbsp;2027), and I&apos;m looking for a new-grad software or data engineering role in health tech, medical devices, or healthcare more broadly.</p>
            <Disclosure label="Why healthcare?">
              <p>My mom has lived with <Term
                def="An autoimmune condition where the body stops making insulin entirely. Not caused by diet or lifestyle, and not the same disease as type 2."
                modal={{ title: "Type 1 diabetes, briefly", content: t1dExplainer }}
              >type&nbsp;1 diabetes</Term> for most of her life, and growing up I watched how directly her health depended on a stack of devices actually working. The insulin pump, whose algorithm re-evaluates every five minutes and adjusts her basal rate and delivers correction boluses to hold a target glucose, and which, depending on the generation of the system, either kept her steady over the long term or didn&apos;t. The continuous glucose monitor, whose accuracy still varies meaningfully between brands, and within a single sensor between its first day and its last. The new infusion set every few days, the new sensor about every week, and the two-hour warm-up before a fresh one will report anything. The pairing between devices that may or may not work out of the box. Even ordering supplies, through a website that adds friction to something she has no choice but to do.</p>
              <p>Seeing all of that up close, and watching which parts improved over the years and which stagnated, gave me a close-up view of what still needs to be built in healthcare technology. It&apos;s the reason I built <a href="#projects">refillr</a>, an iOS app for tracking and refilling medications, and the reason I want to keep working on this: better interfaces, better data infrastructure, tools that ease the burden of managing a chronic condition around the clock.</p>
            </Disclosure>
            <p>This past summer I was a data engineering intern at <strong>Eli Lilly and Company</strong>, on the Consumer Data Engineering team within Business Insights &amp; Analytics, working on how a global team builds <Term def="A dataset built and maintained like a software product: owned, documented, versioned, and reliable enough for other teams to build on.">data products</Term> with <Term def="AI systems that plan and carry out multi-step tasks on their own, calling tools and making decisions along the way, rather than answering a single prompt.">AI agents</Term> in a regulated environment.</p>
            <p>Outside of classes, I&apos;m on the leadership team of <strong>Girls Who Code</strong> at Grinnell; we run a weekly after-school club at the local middle school covering programming fundamentals and robotics, and mostly getting girls excited about computer science.</p>
            <p>I&apos;m available starting June&nbsp;2027.</p>
          </section>

          <section id="experience">
            <p className="label">Experience</p>
            <article className="role">
              <div className="role-top">
                <h3>Eli Lilly and Company</h3>
                <span className="meta">Summer 2026</span>
              </div>
              <p className="role-title">Data Engineering Intern · Consumer Data Engineering, Business Insights &amp; Analytics</p>
              <ul className="role-points">
                <li><b>Defined AI-assisted development standards</b> for BI&amp;A&apos;s agentic data product initiative: standards that hold up in a regulated, <Term def="Protected Health Information: any health data that can be tied to a person. Regulated under HIPAA in the US, so systems that touch it have strict rules about access, handling, and audit.">PHI</Term>-sensitive environment, with <Term def="Writing a precise, reviewable specification of what a system should do before any code is written, then building (and having AI build) against that spec rather than against a conversation.">spec-driven development</Term> at the core.</li>
                <li>Evaluated spec-driven development frameworks (Superpowers, GitHub Spec Kit, and the <Term def="An open-source framework for AI-assisted software development. It gives AI agents defined roles (analyst, architect, developer, and so on) and structured workflows so they build from specs and stories rather than free-form prompts." link={{ href: "https://docs.bmad-method.org", label: "Docs" }}>BMad Method</Term>) for enterprise fit and for fit with the team&apos;s existing day-to-day workflows, and <b>made the recommendation the team adopted</b>.</li>
                <li><b>Architected and built a BMad module</b> for the team&apos;s <Term def="A cloud platform for storing and processing large datasets, built around Apache Spark. Widely used for enterprise data engineering.">Databricks</Term> data product pipeline, covering the full cycle: vendor intake, <Term def="Comparing a new data source against the existing table structure to see what fits as-is and what needs a new column or table.">schema fit/gap</Term>, spec generation, story creation, review, and <Term def="User Acceptance Testing: the final check where the people who requested the work confirm it does what they asked, before it goes to production.">UAT</Term> sign-off. It replaced a manually maintained, non-version-controlled Excel source-to-target mapping with <b>a human- and machine-readable spec that lives in Git</b>, can be updated by AI, and holds transformation logic out by design, so the spec stays a stable interface between requirements and the downstream <Term def="Extract, Transform, Load: the code that pulls data from a source, reshapes it, and writes it into the destination tables.">ETL</Term> implementation.</li>
                <li>Estimated by the team&apos;s leads to <b>cut data product delivery time by two to four weeks</b>, by catching mapping discrepancies at spec review rather than at UAT, where a catch sends the modeling team back through a full rework cycle.</li>
                <li>Built with BMad&apos;s own module-builder tooling; packaged, validated, and wrote cross-platform install scripts for macOS, Linux, and Windows. Delivered on a review branch as a <b>working <Term def="Minimum Viable Product: a first working version with the core functionality in place, built to be tested and extended rather than to be final.">MVP</Term></b> for the team to carry forward.</li>
                <li>Wrote and produced a narrated explainer for the module with <b>Remotion and ElevenLabs</b>, storyboarded across nine scenes with an automated layout audit so the design reference couldn&apos;t drift from the video.</li>
                <li>Worked on a <b>globally distributed agile team of 20+ engineers</b>, tracked in Jira, across roughly 11 vendor sources covering prescription claims, call records, and medication dispense history. Day-to-day in <b>GitHub and Claude Code</b>, with conventional commits and PR review throughout.</li>
              </ul>
            </article>
          </section>

          <section id="projects">
            <p className="label">Projects</p>
            <div className="cards">
              <article className="card" tabIndex={0}>
                <div className="card-top">
                  <h3>refillr</h3>
                  <span className="meta">iOS · Swift · in development</span>
                </div>
                <p>An iOS app for tracking, managing, and refilling medications and supplements, with a customizable interface backed by the NIH&apos;s dietary supplement label and prescription drug databases.</p>
                <a className="card-link" href="https://github.com/abbyressner/refillr" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
              </article>
              <article className="card" tabIndex={0}>
                <div className="card-top">
                  <h3>Non-Human Vision</h3>
                  <span className="meta">Unity · C#</span>
                </div>
                <p>A VR experience for Meta Quest&nbsp;3 that simulates how animals and insects perceive their surroundings, inspired by the toBeeView research project and built by a five-person agile team in Software Design &amp; Development.</p>
                <a className="card-link" href="https://github.com/abbyressner/csc324-group-project" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
              </article>
            </div>
          </section>

          <footer id="contact">
            <p>Say hello at <a href="mailto:contact@abbyressner.com" aria-label="Email contact at abbyressner dot com">contact [at] abbyressner [dot] com</a></p>
            <p>© 2026 Abigail Ressner</p>
          </footer>
        </main>
      </div>
    </>
  );
}
