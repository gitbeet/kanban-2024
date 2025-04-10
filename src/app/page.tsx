"use client";

import clipboardIcon from "../../public/icons/clipboard.png";
import teamIcon from "../../public/icons/team.png";
import rocketIcon from "../../public/icons/rocket.png";
import { SignedOut, useClerk } from "@clerk/nextjs";
import TestArticle from "~/components/landing-page/feature";
import { Button } from "~/components/ui/button/buttons";
import TestStep from "~/components/landing-page/step";
import Section from "~/components/ui/section";
import ColorGradientText from "~/components/ui/typography/color-gradient-text";
import {
  amazonLogo,
  discordLogo,
  netFlixLogo,
  tikTokLogo,
  visaLogo,
  youTubeLogo,
} from "~/components/landing-page/logos";
import { HeroImage } from "~/components/landing-page/hero-image";
import HeroHeading from "~/components/ui/typography/hero-heading";
import HeroSubheading from "~/components/ui/typography/hero-subheading";
import SectionHeading from "~/components/ui/typography/section-heading";
import SectionSubheading from "~/components/ui/typography/section-subheading";

const Hero = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, redirectToSignUp } = useClerk();
  const handleRedirectToSignUp = async () => await redirectToSignUp();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <div className="bg-neutral-25 dark:bg-neutral-900">
      <Section className="relative flex flex-col gap-4 md:flex-row md:gap-16">
        <div className="grow space-y-8 md:space-y-12">
          <div className="z-[2] flex flex-col items-start gap-6 md:py-12">
            <HeroHeading>
              <ColorGradientText text="Organize " />
              <span>
                Your work,
                <br /> Your way
              </span>
            </HeroHeading>
            <HeroSubheading
              text="Streamline tasks, collaborate effortlessly, and boost productivity
              with our Trello-inspired project management tool. Visualize your
              workflow and get things done—faster and smarter!"
              className="z-10 max-w-[700px] text-left"
            />
          </div>
          <SignedOut>
            <div className="flex gap-3">
              <Button onClick={handleRedirectToSignUp} variant="ghost">
                Sign up for free
              </Button>
              <Button onClick={handleRedirectToSignIn}>Sign in</Button>
            </div>
          </SignedOut>
        </div>
        <HeroImage />
      </Section>
    </div>
  );
};

const TrustedBy = () => (
  <Section variant="secondary" className="!py-6">
    <div className="container mx-auto flex flex-wrap justify-between text-slate-400 dark:text-slate-600 md:gap-12">
      {netFlixLogo}
      {youTubeLogo}
      {discordLogo}
      {tikTokLogo}
      {visaLogo}
      {amazonLogo}
    </div>
  </Section>
);

const Features = () => (
  <Section className="space-y-6 md:space-y-12">
    <div className="space-y-3">
      <SectionHeading>
        <>
          Your Workspace, <ColorGradientText text="Optimized" />
        </>
      </SectionHeading>
      <SectionSubheading>
        Everything you need to <b>organize</b> projects and collaborate
        effectively
      </SectionSubheading>
    </div>
    <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:gap-12">
      <TestArticle
        icon={clipboardIcon}
        heading="Organize Your Work"
        body="Create boards, lists, and cards to break down projects into manageable pieces. Drag and drop tasks as they move through your workflow."
      />
      <TestArticle
        icon={teamIcon}
        heading="Teamwork Simplified"
        body="Invite team members to boards, assign tasks, add comments, and track progress together in real-time. No more endless email threads!"
      />
      <TestArticle
        icon={rocketIcon}
        heading="Work From Anywhere"
        body="Access your boards on desktop, tablet, or phone. Your tasks stay in sync across all devices so you're always up to date."
      />
    </div>
  </Section>
);

const Philosophy = () => (
  <Section variant="secondary" className="space-y-6">
    <SectionHeading>
      <>
        Work Should <ColorGradientText text="Flow" />, Not Fight You
      </>
    </SectionHeading>
    <SectionSubheading>
      <p className="mx-auto max-w-2xl">
        At the heart of our tool is the <b>belief</b> that productivity comes
        from clarity, not complexity. We&apos;ve stripped away the unnecessary
        so you can focus on what matters - organizing tasks in a way that feels
        natural and effortless.
      </p>
    </SectionSubheading>
  </Section>
);

const Steps = () => (
  <Section>
    <div className="container space-y-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <SectionHeading>
          <>
            <ColorGradientText text="Get Started" /> in Minutes!
          </>
        </SectionHeading>
        <SectionSubheading>
          Transform chaotic tasks into organized <b>progress</b>
        </SectionSubheading>
      </div>
      <div className="flex flex-col items-stretch justify-center overflow-hidden lg:flex-row">
        <TestStep
          number="01"
          title="Sign Up in Seconds"
          subtitle="Create your free account with just an email address."
          first
        />
        <TestStep
          number="02"
          title="Design Your System"
          subtitle="Create boards with custom lists that match your exact workflow."
        />
        <TestStep
          number="03"
          title="Supercharge Cards"
          subtitle="Add tasks for each column with subtasks and checklists"
          last
        />
      </div>
    </div>
  </Section>
);

const CTA = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, redirectToSignUp } = useClerk();
  const handleRedirectToSignUp = async () => await redirectToSignUp();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <SignedOut>
      <Section variant="secondary">
        <div className="space-y-4">
          <SectionHeading>
            <>
              Ready to <ColorGradientText text="Transform" /> Your Workflow?
            </>
          </SectionHeading>
          <SectionSubheading>
            Join millions of productive <b>users</b> already using taskly
          </SectionSubheading>
        </div>
        <div className="h-8" />
        <div className="z-10 flex justify-center gap-4">
          <Button onClick={handleRedirectToSignUp} variant="ghost">
            Sign up for free
          </Button>
          <Button onClick={handleRedirectToSignIn}>Sign in</Button>
        </div>
      </Section>
    </SignedOut>
  );
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <Philosophy />
      <Steps />
      <CTA />
    </>
  );
}
