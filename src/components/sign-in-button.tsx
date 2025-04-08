import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button/buttons";

const SignInButton = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, loaded } = useClerk();
  const handleRedirectToSignIn = async () => await redirectToSignIn();
  return (
    <>
      {loaded && (
        <Button size="small" onClick={handleRedirectToSignIn}>
          Sign in
        </Button>
      )}
      {!loaded && (
        <Button size="small" variant="primary" disabled>
          Sign in
        </Button>
      )}
    </>
  );
};

export default SignInButton;
