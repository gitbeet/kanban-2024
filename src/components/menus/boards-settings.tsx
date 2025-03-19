import { useUI } from "~/context/ui-context";
import ThemeSwitchUpdated from "../theme-switch-updated";
import { colorBackgrounds, imageBackgrounds } from "~/context/bg-context";
import BackgroundOption from "../background-option";
import { IconButton } from "../ui/button/buttons";
import OpacitySlider from "../opacity-slider";
import FocusTrap from "focus-trap-react";
import { useRef } from "react";

const BoardsSettings = () => {
  const { showBoardsSettings, setShowBoardsSettings } = useUI();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const resolvedTabIndex = showBoardsSettings ? 0 : -1;

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
