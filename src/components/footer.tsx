import ThemeSwitch from "./ui/theme-switch";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="bg-light min-h-[300px] p-8">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="w-60">
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
