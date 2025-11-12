import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";
import Links from "./Links";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">

      <nav className="p-5 flex flex-row justify-end items-center">
        <DarkModeToggle />
      </nav>

      {/* header */}
      <header className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12">
        <div className="flex items-center">
          <Image
            src="/my-emoji.png"
            width={64}
            height={64}
            alt="logo"
          />
        </div>
        <h1 className="heading text-4xl font-bold pt-2">Abigail Ressner</h1>
        <p className="text-xl leading-relaxed">
          Student at Grinnell College
        </p>
      </header>

      {/* main content */}
      <main className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 space-y-12">

      {/* about me section */}
      <section>
        <h2 className="heading text-2xl text-foreground font-semibold mb-4">About Me</h2>
        <p className="text-body">
          Hi! I’m Abby — a junior at 
          <a
            href="https://www.grinnell.edu"
            className="font-medium text-body hover:text-red-600 transition duration-200"
          > Grinnell College</a>, 
          studying Computer Science with a concentration in Statistics. <br /><br />
          
          My passion for technology is rooted in personal experience. 
          My mom has lived with Type 1 diabetes for most of her life, and growing up, I saw how much her medical devices—from insulin pumps to continuous glucose monitors—shaped her daily life. 
          Seeing both the power and the limitations of those technologies motivated me from a young age to one day work on them myself, to support her and everyone who depends on reliable health technology.
          <br /><br />
          
          That goal continues to drive everything I do. 
          I’m particularly interested in software engineering and product design within the health-tech and medical-device space—building intuitive, dependable tools that make managing health easier and less stressful. 
          One of my recent projects, refillr, 
          is an iOS app that helps users track and refill their medications and supplements—designed to simplify an everyday process that often gets overlooked.  
          <br /><br />
          
          Outside of my own work, I’m always learning and building through my coursework, including collaborative projects like 
          <a
            href="#projects"
            className="font-medium text-body hover:text-yellow-500 transition duration-200"
          > Non-Human Vision</a>, 
          a VR simulation developed in my Software Design & Development course.  
          <br /><br />
          
          Beyond coding, I’m passionate about expanding access to computer science education. 
          Since 2024, I’ve volunteered with 
          <a
            href="https://girlswhocode.com/"
            className="font-medium text-body hover:text-pink-500 transition duration-200"
          > Girls Who Code</a> 
          at Grinnell-Newburg Middle School—first as a Facilitator teaching programming fundamentals, and now as a Facilitator Lead overseeing logistics, budgeting, and volunteer coordination. 
          Helping younger students discover the excitement of computing has been one of the most rewarding parts of my college experience.
          <br /><br />
          
          Looking ahead, I’m eager to continue exploring opportunities in software development, especially in health-tech and medical-device innovation, while staying open to any field where technology can make a meaningful impact in people’s lives.
        </p>
      </section>

        {/* projects */}
        <div className="container pb-3">
          <h2 className="heading text-2xl font-semibold mb-4">Projects</h2>
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">

            {/* card 1 - personal website */}
            <div className="card rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <a href="https://github.com/abbyressner/personal-site" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/personalsite-cover1.png"
                  width={200}
                  height={112}
                  alt="Personal Website"
                  style={{ objectFit: "scale-down" }}
                />
                <div className="card p-4">
                  <h3 className="heading text-lg font-semibold">Personal Website</h3>
                  <p className="mt-2 text-body text-sm justify-stretch">
                    A React web app built with
                    <strong className="font-medium text-body hover:text-black dark:hover:text-white transition duration-200">
                      {" "}Next.js{" "}
                    </strong>
                    and
                    <strong className="font-medium text-body hover:text-sky-400 transition duration-200">
                      {" "}Tailwind CSS
                    </strong>
                    , deployed with
                    <strong className="font-medium text-body hover:text-black dark:hover:text-white transition duration-200">
                      {" "}Vercel
                    </strong>
                    .
                  </p>
                </div>
              </a>
            </div>

            {/* card 2 - refillr */}
            <div className="card rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <a href="https://github.com/abbyressner/refillr" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/refillr.jpeg"
                  width={200}
                  height={112}
                  alt="refillr"
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <h3 className="heading text-lg font-semibold">refillr</h3>
                  <p className="mt-2 text-body text-sm">
                    An iOS app that helps users track, manage, and refill their medications and supplements with a customizable interface and reliable product data <i>(currently under development)</i>.
                  </p>
                </div>
              </a>
            </div>

            {/* card 3 - csc324 group project */}
            <div className="card rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <a href="https://github.com/abbyressner/csc324-group-project" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/nonhuman_vision.jpeg"
                  width={200}
                  height={112}
                  alt=""
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  
                  <h3 className="heading text-lg text-body2 font-semibold">Non-Human Vision</h3>
                  <p className="mt-2 text-sm">
                    Inspired by 
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/30128137/"
                      className="font-medium text-body hover:text-yellow-500 transition duration-200">
                      toBeeView
                    </a>
                    — this Unity and C#–based VR experience simulates how animals/insects perceive their surroundings, 
                    using vision models adapted for the 
                    <a
                      href="https://www.meta.com/quest/quest-3/"
                      className="font-medium text-body hover:text-blue-600 transition duration-200">
                      Meta Quest 3
                    </a>.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <Links />

        {/* footer */}
        <footer className="pt-2 pb-8">
          <p className="text-md text-body2 pt-24">
            © 2025 Abigail Ressner <br />
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
              className="text-body2 text-sm"
              target="_blank"
              rel="license noopener noreferrer"
            >
              Licensed under CC BY-SA 4.0
            </a>
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
              target="_blank"
              rel="license noopener noreferrer"
              className="inline-block ml-1"
            >
              <Image
                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                width={16}
                height={16}
                alt="CC"
                className="inline-block"
              />
              <Image
                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                width={16}
                height={16}
                alt="BY"
                className="inline-block ml-1"
              />
              <Image
                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
                width={16}
                height={16}
                alt="SA"
                className="inline-block ml-1"
              />
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
