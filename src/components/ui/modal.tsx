import type { ReactNode } from "react";
import Backdrop from "./backdrop";

export const Modal = ({ children }: { children: ReactNode }) => {
  return <dialog>{children}</dialog>;
};

export const ModalWithBackdrop = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Modal>{children}</Modal>
      <Backdrop />
    </>
  );
};
