import type { ChangeEvent } from "react";
import { useBackground } from "~/context/bg-context";

// export type BlurValue = "none" | "sm" | "md" | "lg" | "xl";

const BlurToggle = ({ tabIndex = 0 }: { tabIndex?: number }) => {
  const { imageBlur, setImageBlur } = useBackground();
  const handleChangeImageBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value);

    setImageBlur(intValue);
  };

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
