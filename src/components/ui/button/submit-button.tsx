import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

const SubmitButton = ({ children, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending}>
      {children}
    </Button>
  );
};

export default SubmitButton;
