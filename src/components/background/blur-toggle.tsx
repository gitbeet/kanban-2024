import type { ChangeEvent } from "react";
import { useBackground } from "~/context/bg-context";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

export type BlurValue = "none" | "sm" | "md" | "lg" | "xl";

const blurMap: Record<number, BlurValue> = {
  0: "none",
  25: "sm",
  50: "md",
  75: "lg",
  100: "xl",
};

const BlurToggle = ({ tabIndex = 0 }: { tabIndex?: number }) => {
  const { imageBlur, setImageBlur } = useBackground();
  const handleChangeImageBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value);
    const blurValue = blurMap[intValue];
    if (!blurValue) {
      showCustomErrorToast({ message: "Client error" });
      return;
    }
    setImageBlur(blurValue);
  };

  const resolvedValue =
    Object.keys(blurMap).find((key) => blurMap[parseInt(key)] === imageBlur) ??
    0;

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
        value={resolvedValue}
        onChange={handleChangeImageBlur}
      />
    </div>
  );
};

export default BlurToggle;
