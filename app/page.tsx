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
      <header className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12 ">
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
            Hi! My name is Abby. I am currently a second-year student at
            <a 
              href="https://www.grinnell.edu" 
              className="font-medium text-body hover:text-red-600 transition duration-200"
              > Grinnell College </a> 
            studying Computer Science and Statistics. <br/><br/>
          </p>
        </section>

        {/* projects */}
        <div className="container pb-4">
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

            {/* card 2 - caesar cipher */}
            <div className="card rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <a href="https://github.com/abbyressner/caesar-cipher" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/caesarcipher-cover-2.jpeg"
                  width={200}
                  height={112}
                  alt="Caesar Cipher"
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <h3 className="heading text-lg text-body2 font-semibold">Caesar Cipher</h3>
                  <p className="mt-2 text-body text-sm text-justify">
                    A C program to encrypt and decrypt messages in a CLI using the Caesar Cipher technique.
                  </p>
                </div>
              </a>
            </div>

            {/* card 3 - pong */}
            <div className="card rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <a href="https://github.com/abbyressner/caesar-cipher" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/pong-cover3.jpeg"
                  width={200}
                  height={112}
                  alt="Pong Game"
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <h3 className="heading text-lg text-body2 font-semibold">Pong Game</h3>
                  <p className="mt-2 text-sm">
                    A simple implementation of a Pong game in
                    <strong className="font-medium hover:text-blue-700 dark:hover:text-blue-600 transition duration-200">
                      {" "}Processing
                    </strong>
                    .
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* footer */}
        <footer className="pt-2 pb-8">
          <p className="text-md text-body2 pt-24">
            © 2024 Abigail Ressner <br />
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