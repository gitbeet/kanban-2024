import SignInButton from "../../ui/button/auth-buttons/sign-in-button";
import SignUpButton from "../../ui/button/auth-buttons/sign-up-button";
import Section from "../../ui/common/section";
import ColorGradientText from "../../ui/typography/color-gradient-text";
import HeroHeading from "../../ui/typography/hero-heading";
import HeroSubheading from "../../ui/typography/hero-subheading";
import { HeroImage } from "../hero-image";

const Hero = ({ loggedIn }: { loggedIn: boolean }) => {
  return (
    <Section className="relative flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="grow space-y-12 md:space-y-16 md:pt-12">
        <div className="z-[2] flex flex-col items-start gap-6">
          <HeroHeading>
            <>
              <ColorGradientText text="Organize " />
              <span>
                Your work,
                <br /> Your way
              </span>
            </>
          </HeroHeading>
          <HeroSubheading
            text="Streamline tasks, collaborate effortlessly, and boost productivity
              with our Trello-inspired project management tool. Visualize your
              workflow and get things done—faster and smarter!"
            className="z-10 max-w-[600px] text-left"
          />
        </div>
        {!loggedIn && (
          <div className="flex gap-3">
            <SignUpButton size="base" variant="ghost" />
            <SignInButton size="base" variant="primary" />
          </div>
        )}
      </div>
      <HeroImage />
    </Section>
  );
};

export default Hero;
