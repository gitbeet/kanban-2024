import {
  amazonLogo,
  discordLogo,
  netFlixLogo,
  tikTokLogo,
  visaLogo,
  youTubeLogo,
} from "~/components/landing-page/logos";
import Section from "~/components/ui/common/section";

const TrustedBy = () => (
  <Section variant="secondary" className="!py-6">
    <div className="container mx-auto flex flex-wrap justify-center gap-6 text-slate-400 dark:text-slate-600 md:gap-12">
      {netFlixLogo}
      {youTubeLogo}
      {discordLogo}
      {tikTokLogo}
      {visaLogo}
      {amazonLogo}
    </div>
  </Section>
);

export default TrustedBy;
