
export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      
      {/* Header */}
      <header className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12 ">
        <div className="flex items-center">
          <img 
              src="/my-emoji.png"
              alt="logo"
              className="w-16 h-16 mr-3 "
          /> 
        </div>
        <h1 className="text-4xl font-bold font-sans pt-2">Abigail Ressner</h1>
        <p className="text-xl text-subtext leading-relaxed">
          Student at Grinnell College
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        {/* About Section */}
        <section id="about">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="">
            Hi! My name is Abby. I am currently a second-year student at
            <a href="https://www.grinnell.edu" className="font-medium text-subtext hover:text-pink-500 transition duration-300"> Grinnell College </a> 
            studying Computer Science and Statistics. <br/><br/>
            ***** Website is currently under construction *****
          </p>
        </section>
{/* 
        Experience Section
        <section id="experience">
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          <ul className="space-y-4">
            <li>
              <strong>GriN Lab</strong> – Research Assistant
              <p className="text-subtext">
                Build and maintain UI components with a focus on accessibility and performance.
              </p>
            </li>
            <li>
              <strong>Girls Who Code</strong> – Facilitator
              <p className="text-subtext">
                Volunteer 
              </p>
            </li>
          </ul>
        </section>

        Projects Section 
        <section id="projects">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <ul className="space-y-4">
            <li>
              <a href="https://github.com/abbyressner/caesar-cipher" className="text-subtext hover:text-violet-500 transition duration-300">
                Caesar Cipher
              </a>
            </li>
            <li>
              <a href="https://github.com/abbyressner/personal-site" className="text-blue-400 hover:text-white transition duration-300">
                Personal Website
              </a>
            </li>
          </ul>
        </section> */}
        <footer className="pb-24">
          <ul className="font-sm mt-8 flex flex-col space-x-0 text-neutral-600 md:flex-row md:space-x-4 dark:text-neutral-300">
            <li>
              <a 
                href="/resume_oct24.pdf"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor"></path>
                </svg>
                <p className="ml-2">
                  resume
                </p>
              </a>
            </li>
          </ul>
        </footer>
      </main>
    </div>
  );
}
