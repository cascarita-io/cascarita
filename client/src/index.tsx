/// <reference types="vite/client" />
import { StrictMode } from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { Auth0Provider, CacheLocation } from "@auth0/auth0-react";
import { createBrowserHistory } from "history";
import "./index.module.css";
import * as Sentry from "@sentry/react";

const ENV_IS_PROD = import.meta.env.VITE_MODE === "production";

if (ENV_IS_PROD) {
  Sentry.init({
    dsn: "https://c3264debab8e92379efef056a7005b80@o4508911694315520.ingest.us.sentry.io/4508911696609280",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/app\.cascarita\.io/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

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
