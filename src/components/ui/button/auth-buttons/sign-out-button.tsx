"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "../button";
import { type AuthButtonProps } from "./sign-in-button";

const SignOutButton = ({ text = "Sign out", ...props }: AuthButtonProps) => {
  const { signOut, loaded } = useClerk();
  const handleSignOut = async () => await signOut();
  return (
    <>
      {loaded && (
        <Button {...props} onClick={handleSignOut}>
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

export default SignOutButton;
