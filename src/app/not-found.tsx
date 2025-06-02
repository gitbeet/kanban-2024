"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button/button";
import HeroSubheading from "~/components/ui/typography/hero-subheading";
import SectionHeading from "~/components/ui/typography/section-heading";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="mx-auto w-full space-y-4 text-center">
      <SectionHeading>
        <>404 - Page Not Found</>
      </SectionHeading>
      <HeroSubheading text="Sorry, the page you’re looking for doesn’t exist or has been moved." />
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => router.push("/")}>Homepage</Button>
        <Button onClick={() => router.back()} variant="ghost">
          Go back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
