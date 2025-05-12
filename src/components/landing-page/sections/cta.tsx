import Section from "~/components/ui/common/section";
import ColorGradientText from "~/components/ui/typography/color-gradient-text";

import SectionHeading from "~/components/ui/typography/section-heading";
import SectionSubheading from "~/components/ui/typography/section-subheading";
import SignInButton from "~/components/ui/button/auth-buttons/sign-in-button";
import SignUpButton from "~/components/ui/button/auth-buttons/sign-up-button";

const CTA = ({ loggedIn }: { loggedIn: boolean }) => {
  return (
    !loggedIn && (
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
          <SignUpButton size="base" variant="ghost" />
          <SignInButton size="base" variant="primary" />
        </div>
      </Section>
    )
  );
};

export default CTA;
