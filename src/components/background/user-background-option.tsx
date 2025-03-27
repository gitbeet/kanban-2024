import { startTransition } from "react";
import { Button } from "../ui/button/buttons";
import { type DeleteUserBackgroundAction } from "~/types/actions";
import { deleteUserBackground } from "~/server/queries";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { useBackground } from "~/context/bg-context";
import { type UserBackgroundType } from "~/types/background";
import BackgroundOptionThumbnail from "./background-option-thumbnail";

const UserBackgroundOption = ({
  background,
}: {
  background: UserBackgroundType;
}) => {
  const { setOptimisticUserBackgrounds } = useBackground();
  const handleDelete = async (backgroundId: string, fileKey: string) => {
    const action: DeleteUserBackgroundAction = {
      type: "DELETE_USER_BACKGROUND",
      payload: { backgroundId, fileKey },
    };
    startTransition(() => {
      setOptimisticUserBackgrounds(action);
    });
    const result = await deleteUserBackground(action);
    if (result?.error) {
      showCustomErrorToast({ message: result.error });
    }
  };
  return (
    <div className="flex flex-col gap-2 text-center">
      <BackgroundOptionThumbnail
        backgroundData={{ type: "user", fileUrl: background.fileUrl }}
      />

      <Button
        size="small"
        variant="ghost"
        onClick={() => handleDelete(background.id, background.fileKey)}
      >
        Delete
      </Button>
    </div>
  );
};

export default UserBackgroundOption;
