import { auth, currentUser } from "@clerk/nextjs/server";
import Hero from "~/components/landing-page/sections/hero";
import TrustedBy from "~/components/landing-page/sections/trusted-by";
import Features from "~/components/landing-page/sections/features";
import Philosophy from "~/components/landing-page/sections/philosophy";
import Steps from "~/components/landing-page/sections/steps";
import CTA from "~/components/landing-page/sections/cta";

const Home = async () => {
  const { userId } = auth();
  const user = userId ? await currentUser() : null;
  return (
    <>
      <Hero loggedIn={!!user} />
      <TrustedBy />
      <Features />
      <Philosophy />
      <Steps />
      <CTA loggedIn={!!user} />
    </>
  );
};

export default Home;
