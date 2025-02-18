import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SlOptions } from "react-icons/sl";
import styles from "./DropdownMenuButton.module.css";
import { useTranslation } from "react-i18next";
import { DropdownMenuButtonProps } from "./types";

const DropdownMenuButton: React.FC<DropdownMenuButtonProps> & {
  Separator: typeof DropdownMenu.DropdownMenuSeparator;
  Item: typeof DropdownMenu.DropdownMenuItem;
} = ({ onEdit, onDelete, onView, children, trigger }) => {
  const { t } = useTranslation("DropdownMenuButton");

  return (
    <div>
      <DropdownMenu.DropdownMenu>
        <DropdownMenu.DropdownMenuTrigger>
          {trigger ? trigger : <SlOptions />}
        </DropdownMenu.DropdownMenuTrigger>

        <DropdownMenu.DropdownMenuContent className={styles.options}>
          {children ? (
            children
          ) : (
            <>
              <DropdownMenu.DropdownMenuItem onSelect={onEdit}>
                {t("option1")}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuSeparator
                className={styles.seperator}
              />

              <DropdownMenu.DropdownMenuItem onSelect={onDelete}>
                {t("option2")}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuSeparator
                className={styles.seperator}
              />

              <DropdownMenu.DropdownMenuItem onSelect={onView}>
                {t("option3")}
              </DropdownMenu.DropdownMenuItem>
            </>
          )}
        </DropdownMenu.DropdownMenuContent>
      </DropdownMenu.DropdownMenu>
    </div>
  );
};

DropdownMenuButton.Separator = DropdownMenu.DropdownMenuSeparator;
DropdownMenuButton.Item = DropdownMenu.DropdownMenuItem;
export default DropdownMenuButton;
