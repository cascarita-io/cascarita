import Page from "../../components/Page/Page";
import Navbar from "../../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Settings.module.css";

const Settings = () => {
  const { t } = useTranslation("Settings");
  return (
    <Page title="Settings" className={styles.settingsPage}>
      <Navbar>
        <Navbar.Item href="">Account Information</Navbar.Item>
        <Navbar.Item href="payment">{t("navBar.payment")}</Navbar.Item>
      </Navbar>

      <Outlet />
    </Page>
  );
};

export default Settings;
