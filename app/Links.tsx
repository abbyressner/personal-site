import React from 'react';
import Image from 'next/image';

const links = [
  {
    href: "mailto:contact@abbyressner.com",
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

const Links = () => {
  return (
    <ul className="flex flex-row space-x-2">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center transition-all ${link.hoverTextColor}`}
          >
            <Image
              src={link.src}
              width={28}
              height={28}
              alt={link.alt}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Links;