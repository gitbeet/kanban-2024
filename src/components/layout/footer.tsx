import { SignedIn } from "@clerk/nextjs";
import Logo from "../common/logo";
import ThemeSwitchUpdated from "../common/theme-switch-updated";
import NavLink from "../ui/nav-link";

const Footer = () => {
  return (
    <footer className="flex min-h-[300px] flex-col justify-between border-t border-neutral-100 bg-white pt-8 dark:border-neutral-700 dark:bg-neutral-850">
      <div className="container flex items-start justify-between px-8 md:items-center">
        <Logo />
        <ul className="flex flex-col gap-4 md:flex-row">
          <li>
            <NavLink title="Home" href="/" />
          </li>
          <SignedIn>
            <li>
              <NavLink title="Boards" href="/boards" />
            </li>
          </SignedIn>
          <li>
            <NavLink title="About" href="/about" />
          </li>
          <li>
            <NavLink title="Contact" href="/contact" />
          </li>
        </ul>
        <ThemeSwitchUpdated />
      </div>
    </footer>
  );
};

export default Footer;
