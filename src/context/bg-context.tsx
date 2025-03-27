"use client";

import { useContext, createContext, useState, useOptimistic } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
  DeleteUserBackgroundAction,
  UploadUserBackgroundAction,
  BackgroundAction,
} from "~/types/actions";
import type {
  BackgroundData,
  BackgroundType,
  UserBackgroundType,
} from "~/types/background";

interface UIProviderProps {
  children: ReactNode;
  backgrounds: BackgroundType[];
  userBackgrounds: UserBackgroundType[];
}

interface BackgroundContextType {
  background: BackgroundData;
  backgrounds: BackgroundType[];
  setBackground: Dispatch<SetStateAction<BackgroundData>>;
  imageOpacity: number;
  setImageOpacity: Dispatch<SetStateAction<number>>;
  optimisticUserBackgrounds: UserBackgroundType[];
  setOptimisticUserBackgrounds: (action: BackgroundAction) => void;
}

const BackgoundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

export const useBackground = () => {
  const context = useContext(BackgoundContext);
  if (!context) {
    throw new Error("Background context not found.");
  }
  return context;
};

export const BackgroundProvider: React.FC<UIProviderProps> = ({
  children,
  backgrounds,
  userBackgrounds,
}) => {
  const tasklyBackground = backgrounds.find((b) => b.slug === "taskly")?.value;
  const [background, setBackground] = useState<BackgroundData>({
    id: "4",
    type: "color",
    value: tasklyBackground ?? "",
  });
  const [imageOpacity, setImageOpacity] = useState(100);
  const [optimisticUserBackgrounds, setOptimisticUserBackgrounds] =
    useOptimistic<UserBackgroundType[], BackgroundAction>(
      userBackgrounds,
      handleOptimisticBackgrounds,
    );

  function handleUploadUserBackground(
    state: UserBackgroundType[],
    payload: UploadUserBackgroundAction["payload"],
  ) {
    const { background } = payload;
    return [...state, background];
  }

  function handleDeleteUserBackground(
    state: UserBackgroundType[],
    payload: DeleteUserBackgroundAction["payload"],
  ) {
    return state.filter((b) => b.id !== payload.backgroundId);
  }

  function handleOptimisticBackgrounds(
    state: UserBackgroundType[],
    action: BackgroundAction,
  ) {
    const { payload, type } = action;
    switch (type) {
      case "UPLOAD_USER_BACKGROUND":
        return handleUploadUserBackground(state, payload);
      case "DELETE_USER_BACKGROUND":
        return handleDeleteUserBackground(state, payload);
      default:
        break;
    }
    return state;
  }

  return (
    <BackgoundContext.Provider
      value={{
        background,
        backgrounds,
        setBackground,
        imageOpacity,
        setImageOpacity,
        optimisticUserBackgrounds,
        setOptimisticUserBackgrounds,
      }}
    >
      {children}
    </BackgoundContext.Provider>
  );
};
