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
  const { imageOpacity, setImageOpacity } = useBackground();
  return (
    <div
      className={` ${showBoardsSettings ? "translate-x-0" : "translate-x-80"} bg-light__test-2 text-dark absolute right-0 z-10 h-screen w-80 p-8 transition`}
    >
      <div className="flex grow justify-end">
        <CloseButton onClick={() => setShowBoardsSettings(false)} />
      </div>
      <div className="flex flex-col gap-8 pt-12">
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
