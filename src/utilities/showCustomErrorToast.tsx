import toast from "react-hot-toast";
import { Button } from "~/components/ui/button/buttons";

export const showCustomErrorToast = ({ message }: { message: string }) => {
  toast.error((t) => (
    <div
      className={`${t.visible ? "animate-enter" : "animate-leave"} flex items-center justify-between gap-2`}
    >
      <p className="text-sm">{message}</p>
      <Button variant="danger" size="small" onClick={() => toast.dismiss(t.id)}>
        Dismiss
      </Button>
    </div>
  ));
};
