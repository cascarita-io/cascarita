import styles from "./NavItem.module.css";
import { NavButtonProps } from "./types";
import { Button } from "@radix-ui/themes";

const NavItem: React.FC<NavButtonProps> = ({
  icon,
  label,
  labelType,
  selected,
  onItemClick,
  className,
}) => {
  const handleClick = () => {
    onItemClick(labelType);
  };

  return (
    <li className={styles.navItem}>
      <Button
        onClick={handleClick}
        variant="soft"
        className={
          selected ? `${styles["button-selected"]} ${className}` : className
        }
      >
        <span className={selected ? styles["icon-selected"] : undefined}>
          {icon}
        </span>
        <span className={selected ? styles["label-selected"] : undefined}>
          {label}
        </span>
      </Button>
    </li>
  );
};

export default NavItem;
