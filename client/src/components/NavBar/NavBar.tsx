import React from "react";
import { NavbarProps, NavbarItemProps } from "./types";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";

const Navbar: React.FC<NavbarProps> & {
  Item: React.FC<NavbarItemProps>;
} = ({ children, className = "" }) => {
  const navbarClassName = `${styles.navbar} ${className}`;
  return (
    <nav id="navbar">
      <ul className={navbarClassName}>{children}</ul>
    </nav>
  );
};

const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  className = "",
  href,
  ...delegated
}) => {
  const navbarItemClassName = `${styles.navbarLink} ${className}`;

  const activeClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? `${navbarItemClassName} ${styles.navbarLinkActive}`
      : navbarItemClassName;
  };

  return (
    <li className={styles.navbarItem}>
      <NavLink
        className={activeClass}
        to={href}
        end // Add the "end" prop to match exactly this path
        {...delegated}
      >
        {children}
      </NavLink>
    </li>
  );
};

Navbar.Item = NavbarItem;
export default Navbar;
