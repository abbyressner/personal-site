

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
          <p className="text-body">
            Hi! My name is Abby. I am currently a second-year student at
            <a 
              href="https://www.grinnell.edu" 
              className="font-medium text-body hover:text-pink-500 transition duration-250"
              > Grinnell College </a> 
            studying Computer Science and Statistics. <br/><br/>
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
        <div className="container pb-4">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            
          <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 ">
              <a href="https://github.com/abbyressner/personal-site" target="_blank" rel="noopener noreferrer">
                <img src="/personalsite-cover1.png" alt="Personal Website" className="w-full h-28 object-scale-down" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">Personal Website</h3>
                    <p className="mt-2 text-body text-sm">
                      A React web app built with
                      <a> Next.js </a>
                      and 
                      <a href="https://tailwindcss.com" className="font-medium text-subtext hover:text-sky-600 transition duration-300"
                      > Tailwind CSS</a>
                      , hosted by
                      <a href="https://vercel.com/home"
                      > Vercel</a>
                      .
                    </p>
                  </div>
              </a>
            </div>

           {/*Caesar Cipher*/}
            <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 ">
              <a href="https://github.com/abbyressner/caesar-cipher" target="_blank" rel="noopener noreferrer">
                <img src="/caesarcipher-cover-2.jpeg" alt="Caesar Cipher" className="w-full h-28 object-cover " />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">Caesar Cipher</h3>
                    <p className="mt-2 text-body text-sm">
                      A C program to encrypt and decrypt messages in a CLI using the Caesar Cipher technique.
                    </p>
                  </div>
              </a>
            </div>

            {/*Pong*/}
            <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 ">
              <a href="https://github.com/abbyressner/caesar-cipher" target="_blank" rel="noopener noreferrer">
                <img src="/pong-cover3.jpeg" alt="Caesar Cipher" className="w-full h-28 object-cover " />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">Pong Game</h3>
                    <p className="mt-2 text-body text-sm">
                      A simple implementation of a Pong game in
                      <a href="https://processing.org" className="font-medium text-subtext hover:text-blue-700 transition duration-250"
                      > Processing</a>
                      .
                    </p>
                  </div>
              </a>
            </div>

          </div>
        </div>

        {/*Footer*/}
        <footer className="pt-2 pb-8">
          <ul className="font-sm mt-8 flex flex-col space-x-0 text-neutral-600 md:flex-row md:space-x-4 dark:text-neutral-300">
          <li>
              <a 
                href="mailto:contactabbyressner@gmail.com"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor"></path>
                </svg>
                <p className="ml-2">
                  email
                </p>
              </a>
            </li>

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

            <li>
              <a 
                href="https://linkedin.com/in/abby-ressner"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor"></path>
                </svg>
                <p className="ml-2">
                  linkedin
                </p>
              </a>
            </li>

            <li>
              <a 
                href="https://github.com/abbyressner"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor"></path>
                </svg>
                <p className="ml-2">
                  github
                </p>
              </a>
            </li>

          </ul>
          <div className="container">
            <p className="text-md text-subtext pt-24">
              © 2024 Abigail Ressner <br/>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" className="text-subtext text-sm" target="_blank" rel="license noopener noreferrer">
                Licensed under CC BY-SA 4.0 </a>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" className="inline-block ml-2">
                <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="CC" className="h-5 inline"/>
                <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="BY" className="h-5 inline ml-1"/>
                <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="SA" className="h-5 inline ml-1"/>
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
