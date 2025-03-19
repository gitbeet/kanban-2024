import React from "react";
import { useBackground } from "~/context/bg-context";

const OpacitySlider = ({ tabIndex = 1 }: { tabIndex?: number }) => {
  const { imageOpacity, setImageOpacity } = useBackground();
  return (
    <div className="space-y-2">
      <h4>Opacity</h4>
      <input
        tabIndex={tabIndex}
        type="range"
        min={0}
        max={100}
        value={imageOpacity}
        onChange={(e) => setImageOpacity(parseInt(e.target.value))}
      />
    </div>
  );
};

export default OpacitySlider;
