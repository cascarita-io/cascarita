import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const renewToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          const tokenExpiry = tokenPayload.exp * 1000;
          const currentTime = Date.now();

          if (tokenExpiry - currentTime < 1 * 60 * 1000) {
            // Renew if less than 1 minutes left
            await getAccessTokenSilently();
          }
        } catch (error) {
          console.error("Error renewing token:", error);
          // Handle token renewal error (e.g., redirect to login)
        }
      }
    };

    // Renew token on component mount and periodically
    renewToken();
    const intervalId = setInterval(renewToken, 60 * 60 * 1000); // Renew every hour

    return () => clearInterval(intervalId);
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div></div>; // Add a loading spinner if desired
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
