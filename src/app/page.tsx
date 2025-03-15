"use client";

import { SignedOut, useClerk } from "@clerk/nextjs";
import Blobs from "~/components/blobs";
import { Button } from "~/components/ui/button/buttons";

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, redirectToSignUp } = useClerk();
  const handleRedirectToSignUp = async () => await redirectToSignUp();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <>
      <section className="section-light section-padding relative flex min-h-[65dvh] flex-col items-center justify-center gap-8 overflow-hidden py-8">
        <Blobs />
        <div className="z-[2] flex flex-col items-center gap-6 md:rounded-md md:bg-white/5 md:px-20 md:py-12 md:drop-shadow-2xl md:backdrop-blur-lg md:dark:bg-neutral-700/15">
          <h1 className="text-dark text-heading z-10 text-center font-black">
            <span className="text-primary-600">Organize</span> Your work, Your
            Way
          </h1>
          <p className="text-light z-10 max-w-[700px] text-center text-lg font-light">
            Streamline tasks, collaborate effortlessly, and boost productivity
            with our Trello-inspired project management tool. Visualize your
            workflow and get things done—faster and smarter!
          </p>
        </div>
        <div className="z-10 flex gap-4">
          <SignedOut>
            <Button onClick={handleRedirectToSignUp} variant="ghost">
              Sign up
            </Button>
            <Button onClick={handleRedirectToSignIn}>Sign in</Button>
          </SignedOut>
        </div>
      </section>
      <section className="section-light section-padding py-16 text-center">
        <div className="mx-auto max-w-[1200px] space-y-4">
          <h2 className="text-dark text-3xl font-bold">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="text-light">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
            nihil nostrum fuga corporis inventore repellat minima illum cum
            accusantium id nobis asperiores officiis, rerum maxime iste
            exercitationem recusandae, neque non beatae consequuntur ad enim!
            Repellendus magnam accusantium a quas eveniet soluta neque fugit
            aspernatur modi! Repellat sequi tenetur ipsa tempore facere
            temporibus sint corrupti labore deserunt quasi dicta, voluptate
            nulla perferendis dignissimos, vitae est aliquam expedita! Ex quas
            sit atque placeat quae tempora inventore, necessitatibus maiores
            beatae nesciunt reprehenderit repudiandae, voluptates deleniti
            facere soluta. Temporibus reprehenderit ratione quae quibusdam qui,
            labore id sit ipsum, quisquam vitae omnis magni maxime neque hic
            amet facilis suscipit, quam architecto non quia. Nobis sed accusamus
            earum nulla molestias nihil asperiores dicta quia autem nesciunt
            quos vel quas delectus assumenda consectetur eum rerum ipsa
            necessitatibus, in doloremque? Iste, iusto quia! Laborum labore
            dolores molestiae delectus dignissimos reiciendis nam eligendi omnis
            commodi possimus iure esse saepe ea rem ducimus vel, amet excepturi
            libero adipisci repudiandae repellat minima animi at est? Animi
            nesciunt eveniet similique nam, in nihil, praesentium, corporis enim
            esse molestiae mollitia maiores expedita aperiam incidunt? Corrupti
            eius nostrum, hic consequatur exercitationem nihil eos fugit,
            voluptas velit dolores voluptatem sint. Minima voluptates voluptatem
            sapiente assumenda.
          </p>
        </div>
      </section>
      <section className="section-padding py-16 text-center">
        <div className="mx-auto max-w-[1200px] space-y-4">
          <h2 className="text-dark text-3xl font-bold">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="text-light">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
            nihil nostrum fuga corporis inventore repellat minima illum cum
            accusantium id nobis asperiores officiis, rerum maxime iste
            exercitationem recusandae, neque non beatae consequuntur ad enim!
            Repellendus magnam accusantium a quas eveniet soluta neque fugit
            aspernatur modi! Repellat sequi tenetur ipsa tempore facere
            temporibus sint corrupti labore deserunt quasi dicta, voluptate
            nulla perferendis dignissimos, vitae est aliquam expedita! Ex quas
            sit atque placeat quae tempora inventore, necessitatibus maiores
            beatae nesciunt reprehenderit repudiandae, voluptates deleniti
            facere soluta. Temporibus reprehenderit ratione quae quibusdam qui,
            labore id sit ipsum, quisquam vitae omnis magni maxime neque hic
            amet facilis suscipit, quam architecto non quia. Nobis sed accusamus
            earum nulla molestias nihil asperiores dicta quia autem nesciunt
            quos vel quas delectus assumenda consectetur eum rerum ipsa
            necessitatibus, in doloremque? Iste, iusto quia! Laborum labore
            dolores molestiae delectus dignissimos reiciendis nam eligendi omnis
            commodi possimus iure esse saepe ea rem ducimus vel, amet excepturi
            libero adipisci repudiandae repellat minima animi at est? Animi
            nesciunt eveniet similique nam, in nihil, praesentium, corporis enim
            esse molestiae mollitia maiores expedita aperiam incidunt? Corrupti
            eius nostrum, hic consequatur exercitationem nihil eos fugit,
            voluptas velit dolores voluptatem sint. Minima voluptates voluptatem
            sapiente assumenda.
          </p>
        </div>
      </section>
    </>
  );
}
