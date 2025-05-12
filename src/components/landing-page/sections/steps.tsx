import Section from "~/components/ui/common/section";
import ColorGradientText from "~/components/ui/typography/color-gradient-text";
import SectionHeading from "~/components/ui/typography/section-heading";
import SectionSubheading from "~/components/ui/typography/section-subheading";
import Step from "../step";

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
        <Step
          number="01"
          title="Sign Up in Seconds"
          subtitle="Create your free account with just an email address."
          first
        />
        <Step
          number="02"
          title="Design Your System"
          subtitle="Create boards with custom lists that match your exact workflow."
        />
        <Step
          number="03"
          title="Supercharge Cards"
          subtitle="Add tasks for each column with subtasks and checklists"
          last
        />
      </div>
    </div>
  </Section>
);

export default Steps;
