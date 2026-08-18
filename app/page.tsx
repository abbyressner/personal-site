import CursorGlow from "./CursorGlow";
import DarkModeToggle from "./DarkModeToggle";

export default function Home() {
  return (
    <>
      <CursorGlow />

      <div className="shell">
        <aside className="rail">
          <div className="rail-top">
            <div>
              <h1 className="wordmark">Abby Ressner</h1>
              <p className="tagline">CS + Statistics @ Grinnell, building software for people who depend on their devices.</p>
            </div>
            <nav>
              <ul className="nav-list">
                <li><a href="#about">About</a></li>
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
            <p className="label" style={{ marginBottom: "0.75rem" }}>About</p>
            <h2>Building for people who depend on their devices</h2>
            <p>My mom has lived with Type&nbsp;1 diabetes for most of her life. Growing up, I watched her medical devices shape her daily routine — and saw both what they made possible and where they still fell short. That&apos;s where my interest in health-tech started, and it&apos;s stayed the throughline of everything I build since.</p>
            <p>I&apos;m a junior at <strong>Grinnell College</strong>, studying Computer Science with a concentration in Statistics. Right now I&apos;m most interested in software engineering and product design for the health-tech and medical-device space — tools that make managing health a little less stressful.</p>
            <p>Since 2024 I&apos;ve also volunteered with <strong>Girls Who Code</strong> at Grinnell-Newburg Middle School, first as a facilitator teaching programming fundamentals, and now leading logistics and volunteer coordination for the chapter.</p>
          </section>

          <section id="projects">
            <p className="label" style={{ marginBottom: "0.75rem" }}>Projects</p>
            <h2 style={{ marginBottom: "1.5rem" }}>Selected work</h2>
            <div className="cards">
              <article className="card" tabIndex={0}>
                <div className="card-top">
                  <h3>refillr</h3>
                  <span className="meta">iOS · Swift</span>
                </div>
                <p>An iOS app that helps people track, manage, and refill their medications and supplements — a customizable interface backed by reliable product data.</p>
                <a className="card-link" href="https://github.com/abbyressner/refillr" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
              </article>
              <article className="card" tabIndex={0}>
                <div className="card-top">
                  <h3>Non-Human Vision</h3>
                  <span className="meta">Unity · C#</span>
                </div>
                <p>A VR experience built for Meta Quest&nbsp;3, simulating how animals and insects perceive their surroundings — inspired by the toBeeView research project, built with a team in Software Design &amp; Development.</p>
                <a className="card-link" href="https://github.com/abbyressner/csc324-group-project" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
              </article>
              <article className="card" tabIndex={0}>
                <div className="card-top">
                  <h3>Girls Who Code — Facilitator Lead</h3>
                  <span className="meta">2024 — present</span>
                </div>
                <p>Started as a volunteer facilitator teaching programming fundamentals to middle schoolers; now lead logistics, budgeting, and volunteer coordination for the chapter.</p>
                <a className="card-link" href="https://girlswhocode.com/" target="_blank" rel="noopener noreferrer">girlswhocode.com →</a>
              </article>
            </div>
          </section>

          <footer id="contact">
            <p>Say hello at <a href="mailto:contact@abbyressner.com">contact@abbyressner.com</a></p>
            <p>© 2026 Abigail Ressner</p>
          </footer>
        </main>
      </div>
    </>
  );
}
