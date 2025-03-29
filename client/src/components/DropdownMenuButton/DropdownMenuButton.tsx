import { SlOptions } from "react-icons/sl";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import styles from "./DropdownMenuButton.module.css";
import { DropdownMenuButtonProps } from "./types";

const DropdownMenuButton: React.FC<DropdownMenuButtonProps> & {
  Separator: typeof DropdownMenu.DropdownMenuSeparator;
  Item: typeof DropdownMenu.DropdownMenuItem;
} = ({ children, trigger, className }) => {
  const dropdownMenuStyles = `${styles.options} ${className}`;

  return (
    <DropdownMenu.DropdownMenu>
      <DropdownMenu.DropdownMenuTrigger>
        {trigger ? trigger : <SlOptions />}
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent className={dropdownMenuStyles}>
        {children}
      </DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenu>
  );
};

DropdownMenuButton.Separator = DropdownMenu.DropdownMenuSeparator;
DropdownMenuButton.Item = DropdownMenu.DropdownMenuItem;
export default DropdownMenuButton;
