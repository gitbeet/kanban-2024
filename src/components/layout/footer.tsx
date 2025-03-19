import Logo from "../logo";
import ThemeSwitchUpdated from "../theme-switch-updated";

const Footer = () => {
  return (
    <footer className="section-light flex min-h-[300px] flex-col justify-between border-t pt-8">
      <div className="container flex items-center justify-between px-8">
        <Logo />
        <ThemeSwitchUpdated />
      </div>
      <div className="bg-dark py-1 text-center">
        <span className="font-bold">taskly </span>
      </div>
    </footer>
  );
};

export default Footer;
