import { StrictMode } from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import { createBrowserHistory } from "history";
import "./index.module.css";

type AppState = {
  returnTo?: string;
};

const onRedirectCallback = (appState: AppState | undefined) => {
  createBrowserHistory().push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const providerConfig = (() => {
  const domain = (import.meta as any).env.VITE_APP_AUTH0_DOMAIN;
  const clientId = (import.meta as any).env.VITE_APP_AUTH0_CLIENT_ID;
  const audience = (import.meta as any).env.VITE_APP_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    throw new Error("Missing Auth0 environment variables");
  }

  return {
    domain,
    clientId,
    onRedirectCallback,
    useRefreshTokens: true,
    cacheLocation: "localstorage" as CacheLocation,
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(audience ? { audience } : null),
    },
  };
})();

createRoot(document.getElementById("root")!).render(
  <Auth0Provider {...providerConfig}>
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
);
