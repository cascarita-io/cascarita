import Page from "../../components/Page/Page";
import Navbar from "../../components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation("Settings");
  return (
    <Page title="Settings">
      <Navbar>
        <Navbar.Item href="">{t("navBar.plan")}</Navbar.Item>
        <Navbar.Item href="payment">{t("navBar.payment")}</Navbar.Item>
      </Navbar>

      <Outlet />
    </Page>
  );
};

export default Settings;
