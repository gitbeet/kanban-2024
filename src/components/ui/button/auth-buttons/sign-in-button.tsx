"use client";

import { useClerk } from "@clerk/nextjs";
import { Button, type ButtonSize, type ButtonVariant } from "../button";

export type AuthButtonProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  text?: string;
};

const SignInButton = ({ text = "Sign in", ...props }: AuthButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, loaded } = useClerk();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <>
      {loaded && (
        <Button {...props} onClick={handleRedirectToSignIn}>
          {text}
        </Button>
      )}
      {!loaded && (
        <Button {...props} disabled>
          {text}
        </Button>
      )}
    </>
  );
};

export default SignInButton;
