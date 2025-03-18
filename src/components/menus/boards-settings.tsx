import { useUI } from "~/context/ui-context";
import ThemeSwitchUpdated from "../theme-switch-updated";
import {
  colorBackgrounds,
  imageBackgrounds,
  useBackground,
} from "~/context/bg-context";
import BackgroundOption from "../background-option";
import { CloseButton } from "../ui/button/buttons";
import OpacitySlider from "../opacity-slider";

const BoardsSettings = () => {
  const { showBoardsSettings, setShowBoardsSettings } = useUI();
  return (
    <div
      className={` ${showBoardsSettings ? "translate-x-0" : "translate-x-80"} bg-light__test-2 text-dark absolute bottom-0 right-0 top-0 z-10 w-80 overflow-auto p-8 transition`}
    >
      <CloseButton
        className="fixed right-4 top-4"
        onClick={() => setShowBoardsSettings(false)}
      />
      <div className="flex flex-col gap-12 pt-8">
        <h2 className="text-lg font-semibold">Background</h2>
        <div className="space-y-4">
          <OpacitySlider />
          <div className="space-y-2">
            <h4>Image</h4>
            <div className="flex flex-wrap gap-3">
              {imageBackgrounds.map((b, i) => (
                <BackgroundOption key={i} background={b} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4>Color</h4>
            <div className="flex flex-wrap gap-3">
              {colorBackgrounds.map((b, i) => (
                <BackgroundOption key={i} background={b} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Theme</h4>
          <ThemeSwitchUpdated />
        </div>
      </div>
    </div>
  );
};

export default BoardsSettings;
