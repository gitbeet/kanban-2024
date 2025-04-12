"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "../button";
import { type AuthButtonProps } from "./sign-in-button";

const SignUpButton = ({
  text = "Sign up for free",
  ...props
}: AuthButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignUp, loaded } = useClerk();
  const handleRedirectToSignUp = async () => await redirectToSignUp();
  return (
    <>
      {loaded && (
        <Button {...props} onClick={handleRedirectToSignUp}>
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

export default SignUpButton;
