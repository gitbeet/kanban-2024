import { useUI } from "~/context/ui-context";
import ThemeSwitchUpdated from "../common/theme-switch-updated";
import BackgroundOption from "../background/background-option";
import { IconButton } from "../ui/button/buttons";
import OpacitySlider from "../background/opacity-slider";
import FocusTrap from "focus-trap-react";
import { useRef } from "react";
// import { colorBackgrounds, imageBackgrounds } from "~/utilities/backgrounds";
import { useBackground } from "~/context/bg-context";
import UploadBackground from "../background/upload-background";
import UserBackgroundOption from "../background/user-background-option";
import BlurToggle from "../background/blur-toggle";
import ExpandMenu from "../ui/expand-menu";
import { motion } from "framer-motion";

const BoardsSettings = () => {
  const { showBoardsSettings, setShowBoardsSettings } = useUI();
  const { optimisticUserBackgrounds, backgrounds } = useBackground();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resolvedTabIndex = showBoardsSettings ? 0 : -1;
  const imageBackgrounds = backgrounds.filter((b) => b.type === "image");
  const colorBackgrounds = backgrounds.filter((b) => b.type === "color");
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
        className={` ${showBoardsSettings ? "translate-x-0" : "translate-x-80"} bg-light__test-2 text-dark absolute bottom-0 right-0 top-0 z-10 w-80 overflow-auto px-4 py-8 shadow-xl transition scrollbar-thin`}
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
          <div className="space-y-8">
            <ExpandMenu header="Background Settings" defaultOpen>
              <OpacitySlider tabIndex={resolvedTabIndex} />
              <BlurToggle />
            </ExpandMenu>
            <ExpandMenu header="Color backgrounds" defaultOpen>
              <div className="flex flex-wrap gap-3">
                {colorBackgrounds.map((b, i) => (
                  <BackgroundOption
                    key={i}
                    background={b}
                    tabIndex={resolvedTabIndex}
                  />
                ))}
              </div>
            </ExpandMenu>
            <ExpandMenu header="Image backgrounds">
              <div className="flex flex-wrap gap-3">
                {imageBackgrounds.map((b, i) => (
                  <BackgroundOption
                    key={i}
                    background={b}
                    tabIndex={resolvedTabIndex}
                  />
                ))}
              </div>
            </ExpandMenu>
            <ExpandMenu header="User backgrounds">
              <div className="flex flex-wrap gap-3">
                {optimisticUserBackgrounds.map((b) => (
                  <UserBackgroundOption key={b.id} background={b} />
                ))}
                <UploadBackground />
              </div>
            </ExpandMenu>
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
