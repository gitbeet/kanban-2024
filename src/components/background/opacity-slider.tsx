import { useBackground } from "~/context/bg-context";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { modifyUserData } from "~/server/queries";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

const DEBOUNCE_DELAY = 1500;

const OpacitySlider = ({ tabIndex = 1 }: { tabIndex?: number }) => {
  const { imageOpacity, setImageOpacity } = useBackground();
  const handleChangeDbOpacity = useDebouncedCallback(
    async (newOpacity: number) => {
      const result = await modifyUserData({ backgroundOpacity: newOpacity });
      if (result?.error) showCustomErrorToast({ message: result.error });
    },
    DEBOUNCE_DELAY,
  );

  const changeOpacity = async () => {
    try {
      await handleChangeDbOpacity(imageOpacity);
    } catch (error) {
      showCustomErrorToast({ message: "Client error" });
    }
  };

  useEffect(() => {
    changeOpacity()
      .then()
      .catch(() => showCustomErrorToast({ message: "Client error" }));
  }, [imageOpacity]);

  return (
    <div className="space-y-2">
      <h4>Opacity</h4>
      <input
        aria-label="Adjust the background opacity"
        tabIndex={tabIndex}
        type="range"
        min={0}
        max={100}
        step={1}
        value={imageOpacity}
        onChange={(e) => setImageOpacity(parseInt(e.target.value))}
      />
    </div>
  );
};

export default OpacitySlider;
