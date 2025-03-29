import { Button } from "@radix-ui/themes";

import styles from "./PrimaryButton.module.css";
import { PrimaryButtonProps } from "./types";

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  const buttonClassName = `${styles.primary} ${className}`;

  return (
    <Button className={buttonClassName} onClick={onClick}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
