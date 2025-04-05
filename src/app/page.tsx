"use client";

import clipboardIcon from "../../public/icons/clipboard.png";
import teamIcon from "../../public/icons/team.png";
import rocketIcon from "../../public/icons/rocket.png";

import { SignedOut, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import TestArticle from "~/components/common/test-article";
import { Button } from "~/components/ui/button/buttons";
import hero from "../../public/hero.png";
import TestStep from "~/components/common/test-step";
import Section from "~/components/ui/section";
import GradientText from "~/components/ui/gradient-text";

import {
  amazonLogo,
  discordLogo,
  netFlixLogo,
  tikTokLogo,
  visaLogo,
  youTubeLogo,
} from "~/components/common/logos";

const Hero = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, redirectToSignUp } = useClerk();
  const handleRedirectToSignUp = async () => await redirectToSignUp();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <div className="bg-neutral-25 dark:bg-neutral-900">
      <Section className="relative gap-4 overflow-hidden py-12 md:flex">
        <div className="grow">
          <div className="z-[2] flex flex-col items-start gap-6 md:py-12">
            <h1 className="text-dark text-heading z-10 text-left font-black">
              <GradientText text="Organize" /> Your work,
              <br /> Your Way
            </h1>
            <p className="text-light z-10 max-w-[700px] text-left text-lg">
              Streamline tasks, collaborate effortlessly, and boost productivity
              with our Trello-inspired project management tool. Visualize your
              workflow and get things done—faster and smarter!
            </p>
          </div>
          <div className="z-10 flex gap-4">
            <SignedOut>
              <Button onClick={handleRedirectToSignUp} variant="ghost">
                Sign up for free
              </Button>
              <Button onClick={handleRedirectToSignIn}>Sign in</Button>
            </SignedOut>
          </div>
        </div>
        <Image
          src={hero}
          objectFit="cover"
          alt="hero"
          placeholder="empty"
          className="animate-float"
        />
        <div className="h-8" />
      </Section>
    </div>
  );
};

const TrustedBy = () => (
  <section className="z-10 border-y border-neutral-100 bg-white shadow-lg shadow-neutral-250/15 dark:border-neutral-750 dark:bg-neutral-850 dark:shadow-neutral-950/5">
    <div className="container mx-auto flex flex-wrap justify-center gap-12 py-5 text-neutral-500">
      {netFlixLogo}
      {youTubeLogo}
      {discordLogo}
      {tikTokLogo}
      {visaLogo}
      {amazonLogo}
    </div>
  </section>
);

const Features = () => (
  <Section>
    <div className="text-center">
      <h2 className="text-4xl font-black">
        Your Workspace, <GradientText text="Optimized" />
      </h2>
      <div className="h-4" />
      <p className="text-light text-lg">
        Everything you need to organize projects and collaborate effectively
      </p>
    </div>
    <div className="h-16" />
    <div className="flex w-full flex-col items-center justify-center gap-12 lg:flex-row lg:items-stretch">
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

const Phylosophy = () => (
  <Section variant="secondary">
    <div className="container flex flex-col items-center">
      <h2 className="text-center text-4xl font-black">
        Work Should <GradientText text="Flow" />, Not Fight You
      </h2>
      <div className="h-4" />
      <p className="text-light max-w-2xl text-center">
        At the heart of our tool is the belief that productivity comes from
        clarity, not complexity. We&apos;ve stripped away the unnecessary so you
        can focus on what matters - organizing tasks in a way that feels natural
        and effortless.
      </p>
    </div>
  </Section>
);

const Steps = () => (
  <Section>
    <div className="container space-y-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-black">
          <GradientText text="Get Started" /> in Minutes!
        </h2>
        <p className="text-light max-w-2xl text-center">
          Transform chaotic tasks into organized progress
        </p>
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
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-black">
            Ready to <GradientText text="Transform" /> Your Workflow?
          </h2>
          <p className="text-light text-lg">
            Join thousands of productive teams already using taskly
          </p>
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
      <Phylosophy />
      <Steps />
      <CTA />
    </>
  );
}
