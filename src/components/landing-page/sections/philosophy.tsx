import Section from "~/components/ui/common/section";
import ColorGradientText from "~/components/ui/typography/color-gradient-text";
import SectionHeading from "~/components/ui/typography/section-heading";
import SectionSubheading from "~/components/ui/typography/section-subheading";

const Philosophy = () => (
  <Section variant="secondary" className="space-y-6">
    <SectionHeading>
      <>
        Work Should <ColorGradientText text="Flow" />, Not Fight You
      </>
    </SectionHeading>
    <SectionSubheading>
      <span className="mx-auto max-w-2xl">
        At the heart of our tool is the <b>belief</b> that productivity comes
        from clarity, not complexity. We&apos;ve stripped away the unnecessary
        so you can focus on what matters - organizing tasks in a way that feels
        natural and effortless.
      </span>
    </SectionSubheading>
  </Section>
);

export default Philosophy;
