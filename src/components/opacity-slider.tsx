import React from "react";
import { useBackground } from "~/context/bg-context";

const OpacitySlider = () => {
  const { imageOpacity, setImageOpacity } = useBackground();
  return (
    <div className="space-y-2">
      <h4>Opacity</h4>
      <input
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
