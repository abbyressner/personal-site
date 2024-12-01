import React from 'react';
import Image from 'next/image';

const Links = [
  {
    href: "mailto:contactabbyressner@gmail.com",
    src: "/email-icon.svg",
    alt: "email icon",
    hoverTextColor: "hover:text-neutral-800 dark:hover:text-neutral-100",
  },
  {
    href: "https://linkedin.com/in/abby-ressner",
    src: "/linkedin-icon.svg",
    alt: "linkedin icon",
    hoverTextColor: "hover:text-neutral-900 dark:hover:text-neutral-100",
  },
  {
    href: "https://github.com/abbyressner",
    src: "/github-icon.svg",
    alt: "github icon",
    hoverTextColor: "hover:text-neutral-900 dark:hover:text-neutral-100",
  },
  {
    href: "https://codepen.io/abbyressner",
    src: "/codepen-icon.svg",
    alt: "codepen icon",
    hoverTextColor: "hover:text-neutral-900 dark:hover:text-neutral-100",
  },
];

const SocialLinks = () => {
  return (
    <ul className="flex flex-row space-x-2">
      {socialLinks.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center transition-all ${link.hoverTextColor}`}
          >
            <Image
              src={link.src}
              width={20}
              height={20}
              alt={link.alt}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Links;