import { useUI } from "~/context/ui-context";
import ThemeSwitchUpdated from "../common/theme-switch-updated";
import BackgroundOption from "../background/background-option";
import { Button, IconButton } from "../ui/button/buttons";
import OpacitySlider from "../background/opacity-slider";
import FocusTrap from "focus-trap-react";
import { startTransition, useRef } from "react";
import { colorBackgrounds, imageBackgrounds } from "~/utilities/backgrounds";
import { UploadButton } from "~/utilities/uploadthing";
import { useBackground } from "~/context/bg-context";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { type UserBackgroundType } from "~/types";
import { v4 as uuid } from "uuid";
import { deleteBackground, uploadBackground } from "~/server/queries";
import { type ClientUploadedFileData } from "uploadthing/types";
import { useUser } from "@clerk/nextjs";
import type {
  DeleteUserBackgroundAction,
  UploadUserBackgroundAction,
} from "~/types/actions";

const BoardsSettings = () => {
  const { showBoardsSettings, setShowBoardsSettings } = useUI();
  const { optimisticUserBackgrounds, setOptimisticUserBackgrounds } =
    useBackground();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const resolvedTabIndex = showBoardsSettings ? 0 : -1;

  const user = useUser();

  const handleUpload = async (
    res: ClientUploadedFileData<{
      fileKey: string;
      fileUrl: string;
      userId: string;
    }>[],
  ) => {
    if (!res[0] || !user.user?.id) return;
    const { key, ufsUrl } = res[0];
    const background: UserBackgroundType = {
      createdAt: new Date(),
      id: uuid(),
      fileKey: key,
      fileUrl: ufsUrl,
      userId: user.user.id,
    };

    const action: UploadUserBackgroundAction = {
      type: "UPLOAD_USER_BACKGROUND",
      payload: { background },
    };

    startTransition(() => {
      setOptimisticUserBackgrounds(action);
    });

    const result = await uploadBackground(action);
    if (result?.error) {
      showCustomErrorToast({ message: result.error });
    }
  };

  const handleDelete = async (backgroundId: string, fileKey: string) => {
    const action: DeleteUserBackgroundAction = {
      type: "DELETE_USER_BACKGROUND",
      payload: { backgroundId, fileKey },
    };
    startTransition(() => {
      setOptimisticUserBackgrounds(action);
    });
    const result = await deleteBackground(action);
    if (result?.error) {
      showCustomErrorToast({ message: result.error });
    }
  };

  return (
    <FocusTrap
      active={showBoardsSettings}
      focusTrapOptions={{
        checkCanFocusTrap: () =>
          new Promise((resolve) => setTimeout(resolve, 300)),
        allowOutsideClick: true,
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        onDeactivate: () => setShowBoardsSettings(false),
      }}
    >
      <div
        className={` ${showBoardsSettings ? "translate-x-0" : "translate-x-80"} bg-light__test-2 text-dark absolute bottom-0 right-0 top-0 z-10 w-80 overflow-auto p-8 shadow-xl transition`}
      >
        <IconButton
          aria-label="Close the settings menu"
          className="absolute right-4 top-4"
          ref={closeButtonRef}
          preset="close"
          onClick={() => setShowBoardsSettings(false)}
          tabIndex={resolvedTabIndex}
        />

        <div className="flex flex-col gap-12 pt-8">
          <h2 className="text-lg font-semibold">Background</h2>
          <div className="space-y-4">
            <OpacitySlider tabIndex={resolvedTabIndex} />
            <div className="space-y-2">
              <h4>Image</h4>
              <div className="flex flex-wrap gap-3">
                {imageBackgrounds.map((b, i) => (
                  <BackgroundOption
                    key={i}
                    background={b}
                    tabIndex={resolvedTabIndex}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4>User</h4>
              <div className="flex flex-wrap gap-3">
                {optimisticUserBackgrounds.map((b) => (
                  <div key={b.id} className="space-y-2 text-center">
                    <div className="aspect-video w-28 overflow-hidden">
                      <img
                        src={b.fileUrl}
                        className="object-cover"
                        alt="User defined image"
                      />
                    </div>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => handleDelete(b.id, b.fileKey)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <UploadButton
                  className="aspect-video w-28 rounded bg-primary-700 text-sm"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => handleUpload(res)}
                  onUploadError={(error: Error) =>
                    showCustomErrorToast({ message: error.message })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4>Color</h4>
              <div className="flex flex-wrap gap-3">
                {colorBackgrounds.map((b, i) => (
                  <BackgroundOption
                    key={i}
                    background={b}
                    tabIndex={resolvedTabIndex}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Theme</h4>
            <ThemeSwitchUpdated tabIndex={resolvedTabIndex} />
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default BoardsSettings;
