import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterModal from "../../components/RegistrationModal/RegistrationModal";
import { fetchUser } from "../../api/users/service";
import Cookies from "js-cookie";
import Navbar from "../../components/NavBar/NavBar";
import Page from "../../components/Page/Page";

const Home = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (isAuthenticated && user) {
        try {
          Cookies.set("email", user.email || "");
          const token = await getAccessTokenSilently();
          const response = await fetchUser(user.email || "", token);
          setRegistered(response?.isSigningUp ? false : true);
          Cookies.set("group_id", response?.group_id || 0);
        } catch (error) {
          console.error("Error checking registration status:", error);
          setRegistered(false);
        }
      } else {
        setRegistered(false);
      }
    };

    checkRegistrationStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Move the modal opening logic to a useEffect hook to avoid triggering re-renders
  useEffect(() => {
    if (registered === false && isAuthenticated) {
      setIsRegisterModalOpen(true);
    }
  }, [registered, isAuthenticated, isRegisterModalOpen]);

  useEffect(() => {
    if (!isRegisterModalOpen && (registered === null || registered === false)) {
      setIsRegisterModalOpen(true);
    }
  }, [isRegisterModalOpen, registered]);

  // Function to handle registration completion
  const handleRegistrationComplete = () => {
    setRegistered(true);
    setIsRegisterModalOpen(false);
  };

  if (registered === null) {
    return <></>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          {!registered && (
            <RegisterModal
              open={isRegisterModalOpen}
              onOpenChange={setIsRegisterModalOpen}
              onRegistrationComplete={handleRegistrationComplete}
            >
              <></>
            </RegisterModal>
          )}
          <Page title="Welcome!">
            <Navbar>
              <Navbar.Item href="">Leagues</Navbar.Item>
              <Navbar.Item href="seasons">Seasons</Navbar.Item>
              <Navbar.Item href="divisions">Divisions</Navbar.Item>
              <Navbar.Item href="teams">Teams</Navbar.Item>
              <Navbar.Item href="players">Players</Navbar.Item>
            </Navbar>

            <Outlet />
          </Page>
        </>
      ) : (
        <p>Not authenticated...</p>
      )}
    </>
  );
};

export default Home;
