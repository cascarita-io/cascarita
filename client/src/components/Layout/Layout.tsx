import styles from "./Layout.module.css";
import { LayoutProps, blackListExceptions } from "./types";
import SideNav from "../SideNav/SideNav";
import { useState } from "react";
import { blackListRoutes } from "./blacklist";
import { useAuth0 } from "@auth0/auth0-react";
import { matchPath } from "../../utils/matchPath";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { ToastContainer } from "react-toastify";

const Layout: React.FC<LayoutProps> = () => {
  const { user } = useAuth0();
  const currentUser = user;
  const [selectedItem, setSelectedItem] = useState("");

  const isBlacklisted = blackListRoutes.some((pattern) =>
    matchPath(window.location.pathname, pattern, blackListExceptions)
  );

  return (
    <>
      {!isBlacklisted && currentUser ? (
        <main className={styles.layout}>
          <Header />

          <Outlet />

          <SideNav
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </main>
      ) : (
        <main className={styles.formLayout}>
          <Outlet />
        </main>
      )}
    </>
  );
};

export default Layout;
