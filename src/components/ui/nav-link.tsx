import Link from "next/link";

const NavLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link
      className="dark:text-neutral-200 text-neutral-700 transition hover:text-neutral-950 dark:hover:text-white"
      href={href}
    >
      {title}
    </Link>
  );
};

export default NavLink;
