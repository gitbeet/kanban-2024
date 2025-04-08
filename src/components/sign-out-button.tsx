import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button/buttons";

const SignOutButton = () => {
  const { signOut, loaded } = useClerk();
  const handleSignOut = async () => await signOut();
  return (
    <>
      {loaded && (
        <Button size="small" variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      )}
      {!loaded && (
        <Button size="small" variant="ghost" disabled>
          Sign out
        </Button>
      )}
    </>
  );
};

export default SignOutButton;
