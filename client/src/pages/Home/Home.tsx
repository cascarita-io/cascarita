import Leagues from "../Leagues/Leagues";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterModal from "../../components/RegistrationModal/RegistrationModal";
import { fetchUser } from "../../api/users/service";
import Cookies from "js-cookie";

const Home = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [registered, setRegistered] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (isAuthenticated && user) {
        try {
          Cookies.set("email", user.email || "");
          const token = await getAccessTokenSilently();
          const response = await fetchUser(user.email || "", token);
          setRegistered(response?.isSigningUp ? false : true);
        } catch (error) {
          console.error("Error checking registration status:", error);
        }
      }
    };

    checkRegistrationStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Move the modal opening logic to a useEffect hook to avoid triggering re-renders
  useEffect(() => {
    if (!registered && isAuthenticated) {
      setIsRegisterModalOpen(true);
    }
  }, [registered, isAuthenticated, isRegisterModalOpen]);

  // Function to handle registration completion
  const handleRegistrationComplete = () => {
    setRegistered(true);
    setIsRegisterModalOpen(false);
  };

  const location = useLocation();
  const isSeasonRoute = location.pathname.includes("season");

  if (isSeasonRoute) {
    return <Outlet />;
  }

  return (
    <>
      {isAuthenticated ? (
        <div>
          {!registered && (
            <RegisterModal
              open={isRegisterModalOpen}
              onOpenChange={setIsRegisterModalOpen}
              onRegistrationComplete={handleRegistrationComplete}
            >
              <></>
            </RegisterModal>
          )}
          {/*TODO: Find out why the League Component gets rendered twice  */}
          <Leagues />
        </div>
      ) : (
        <p>Not authenticated...</p>
      )}
    </>
  );
};

export default Home;
