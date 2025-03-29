import { useBackground } from "~/context/bg-context";

const OpacitySlider = ({ tabIndex = 1 }: { tabIndex?: number }) => {
  const { imageOpacity, setImageOpacity } = useBackground();
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
