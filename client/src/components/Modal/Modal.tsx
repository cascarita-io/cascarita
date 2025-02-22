import React from "react";
import styles from "./Modal.module.css";
import { ModalProps, ModalContentProps } from "./types";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

const Modal: React.FC<ModalProps> & {
  Button: React.FC<React.ComponentProps<typeof Dialog.Trigger>>;
  Content: React.FC<ModalContentProps>;
  Close: typeof Dialog.Close;
} = ({ open, onOpenChange, defaultOpen = false, children }) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {children}
    </Dialog.Root>
  );
};

const ModalContent: React.FC<ModalContentProps> = ({
  title,
  subtitle,
  children,
  maximize = false,
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={`${maximize ? styles.maximizeContent : styles.content}`}
      >
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>
        <Dialog.Description className={styles.subtitle}>
          {subtitle}
        </Dialog.Description>
        <Dialog.Close className={`${styles.closeIcon}`}>
          <Cross1Icon />
        </Dialog.Close>

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

Modal.Button = Dialog.Trigger;
Modal.Content = ModalContent;
Modal.Close = Dialog.Close;
export default Modal;
