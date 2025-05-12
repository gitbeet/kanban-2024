import Section from "~/components/ui/common/section";
import ColorGradientText from "~/components/ui/typography/color-gradient-text";
import SectionHeading from "~/components/ui/typography/section-heading";
import SectionSubheading from "~/components/ui/typography/section-subheading";
import Feature from "../feature";
import clipboardIcon from "../../../../public/icons/clipboard.png";
import teamIcon from "../../../../public/icons/team.png";
import rocketIcon from "../../../../public/icons/rocket.png";

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
      <Feature
        icon={clipboardIcon}
        heading="Organize Your Work"
        body="Create boards, lists, and cards to break down projects into manageable pieces. Drag and drop tasks as they move through your workflow."
      />
      <Feature
        icon={teamIcon}
        heading="Teamwork Simplified"
        body="Invite team members to boards, assign tasks, add comments, and track progress together in real-time. No more endless email threads!"
      />
      <Feature
        icon={rocketIcon}
        heading="Work From Anywhere"
        body="Access your boards on desktop, tablet, or phone. Your tasks stay in sync across all devices so you're always up to date."
      />
    </div>
  </Section>
);

export default Features;
