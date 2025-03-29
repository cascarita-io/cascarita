import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiUsers } from "react-icons/fi";
// import { MdOutlineCalendarToday } from "react-icons/md";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHomeLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

import CascaritaLogo from "../../assets/Logos/CascaritaLogo/CascaritaLogo";
import LogoutButton from "../LogoutButton/LogoutButton";
import NavItem from "../NavItem/NavItem";
import styles from "./SideNav.module.css";
import { SideNavProps } from "./types";

const SideNav: React.FC<SideNavProps> = ({ selectedItem, setSelectedItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("SideNav");

  useEffect(() => {
    const currentPath = location.pathname.substring(1); // Remove the leading '/'
    setSelectedItem(currentPath);
  }, [location.pathname, setSelectedItem]);

  const handleItemClick = (labelType: string) => {
    let newRoute = "/";
    switch (labelType) {
      case "item1":
        newRoute = "";
        break;
      case "item2":
        newRoute = "users";
        break;
      case "item4":
        newRoute = "forms";
        break;
      case "item5":
        newRoute = "settings";
        break;
      default:
        newRoute = "/";
    }
    setSelectedItem(newRoute);
    navigate(`/${newRoute}`);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarTop}>
        <CascaritaLogo className={styles.logo} width={180} height={80} />

        <ul className={styles.navbarList}>
          <NavItem
            icon={<RiHomeLine />}
            label={t("item1")}
            labelType="item1"
            selected={selectedItem === "" || selectedItem.includes("season")}
            onItemClick={handleItemClick}
            className={styles.navbarListItem}
          />
          <NavItem
            icon={<FiUsers />}
            label={t("item2")}
            labelType="item2"
            selected={selectedItem === "users"}
            onItemClick={handleItemClick}
            className={styles.navbarListItem}
          />
          {/* NOTE: UNCOMMENT ONCE SCHEDULING ADDED
          <NavItem
          icon={<MdOutlineCalendarToday />}
          label={t("item3")}
          labelType="item3"
          selected={selectedItem === "schedule"}
          onItemClick={handleItemClick}
        /> */}
          <NavItem
            icon={<HiOutlinePencilAlt />}
            label={t("item4")}
            labelType="item4"
            selected={selectedItem.includes("forms")}
            onItemClick={handleItemClick}
            className={styles.navbarListItem}
          />
          <NavItem
            icon={<IoSettingsOutline />}
            label={t("item5")}
            labelType="item5"
            selected={selectedItem.includes("settings")}
            onItemClick={handleItemClick}
            className={styles.navbarListItem}
          />
        </ul>
      </div>

      <div className={styles.navbarBottom}>
        <LogoutButton
          className={`${styles.logoutButton} ${styles.navbarListItem} `}
          icon={<TbLogout />}
          label={t("item6")}
        />
      </div>
    </nav>
  );
};

export default SideNav;
