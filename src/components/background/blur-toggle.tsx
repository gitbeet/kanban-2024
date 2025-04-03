import { useEffect, type ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useBackground } from "~/context/bg-context";
import { modifyUserData } from "~/server/queries";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

const DEBOUNCE_DELAY = 1500;

const BlurToggle = ({ tabIndex = 0 }: { tabIndex?: number }) => {
  const { imageBlur, setImageBlur } = useBackground();
  const handleChangeImageBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value);

    setImageBlur(intValue);
  };

  const handleChangeDbBlur = useDebouncedCallback(async (newBlur: number) => {
    const result = await modifyUserData({ backgroundBlur: newBlur });
    if (result?.error) showCustomErrorToast({ message: result.error });
  }, DEBOUNCE_DELAY);

  const changeBlur = async () => {
    try {
      await handleChangeDbBlur(imageBlur);
    } catch (error) {
      showCustomErrorToast({ message: "Client error" });
    }
  };

  useEffect(() => {
    changeBlur()
      .then()
      .catch(() => showCustomErrorToast({ message: "Client error" }));
  }, [imageBlur]);

  return (
    <div className="space-y-2">
      {/* use label */}
      <h4 className="text-light">Background blur</h4>
      <input
        type="range"
        min={0}
        max={100}
        step={25}
        className="w-full grow accent-primary-700"
        aria-label="Adjust the background blur"
        tabIndex={tabIndex}
        value={imageBlur}
        onChange={handleChangeImageBlur}
      />
    </div>
  );
};

export default BlurToggle;
