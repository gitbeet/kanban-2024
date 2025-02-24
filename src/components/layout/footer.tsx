import Logo from "../logo";
import ThemeSwitchUpdated from "../theme-switch-updated";

const Footer = () => {
  return (
    <footer className="bg-light min-h-[300px] border-t border-neutral-250 p-8 dark:border-neutral-650">
      <div className="flex items-center justify-between">
        <Logo />
        <ThemeSwitchUpdated />
      </div>
    </footer>
  );
};

export default Footer;
