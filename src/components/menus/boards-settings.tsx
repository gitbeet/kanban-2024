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
import { sidebarTransition } from "~/utilities/framer-motion";

const BoardsSettings = () => {
  const {
    showBoardsSettings,
    setShowBoardsSettings,
    boardsSettingsAnimating,
    setBoardsSettingsAnimating,
  } = useUI();
  const { optimisticUserBackgrounds, backgrounds } = useBackground();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageBackgrounds = backgrounds.filter((b) => b.type === "image");
  const colorBackgrounds = backgrounds.filter((b) => b.type === "color");
  const resolvedTabIndex = showBoardsSettings ? 0 : -1;
  return (
    <motion.aside
      onAnimationStart={() => setBoardsSettingsAnimating(true)}
      onAnimationComplete={() => setBoardsSettingsAnimating(false)}
      initial={false}
      animate={{
        x: showBoardsSettings ? 0 : 80,
        opacity: showBoardsSettings ? 1 : 0,
      }}
      transition={sidebarTransition}
      tabIndex={showBoardsSettings ? 0 : -1}
      className={` ${showBoardsSettings ? "" : "pointer-events-none"} bg-light__test-2 text-dark absolute bottom-0 right-0 top-0 z-10 w-[min(100dvw,320px)] overflow-auto px-4 py-8 shadow-xl scrollbar-thin`}
    >
      <FocusTrap
        active={showBoardsSettings}
        focusTrapOptions={{
          checkCanFocusTrap: () =>
            new Promise((resolve) => setTimeout(resolve, 500)),
          allowOutsideClick: true,
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
          onDeactivate: () => setShowBoardsSettings(false),
        }}
      >
        <div>
          <IconButton
            aria-label="Close the settings menu"
            className="absolute right-4 top-4"
            ref={closeButtonRef}
            preset="close"
            onClick={() => setShowBoardsSettings(false)}
            tabIndex={resolvedTabIndex}
            disabled={boardsSettingsAnimating}
          />

          <div className="flex flex-col gap-12 pt-8">
            <h2 className="text-lg font-semibold">Background</h2>
            <div className="space-y-8">
              <ExpandMenu
                disabled={boardsSettingsAnimating}
                header="Background Settings"
                tabIndex={resolvedTabIndex}
                defaultOpen
              >
                <OpacitySlider tabIndex={resolvedTabIndex} />
                <BlurToggle tabIndex={resolvedTabIndex} />
              </ExpandMenu>
              <ExpandMenu
                disabled={boardsSettingsAnimating}
                header="Color backgrounds"
                tabIndex={resolvedTabIndex}
                defaultOpen
              >
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
              <ExpandMenu
                disabled={boardsSettingsAnimating}
                header="Image backgrounds"
                tabIndex={resolvedTabIndex}
              >
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
              <ExpandMenu
                header="User backgrounds"
                tabIndex={resolvedTabIndex}
                disabled={boardsSettingsAnimating}
              >
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
              <div className="pl-2">
                <ThemeSwitchUpdated
                  tabIndex={resolvedTabIndex}
                  disabled={boardsSettingsAnimating}
                />
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </motion.aside>
  );
};

export default BoardsSettings;
