require("dotenv").config();
const Sentry = require("@sentry/node");

if (process.env.SENTRY_ENABLED === "true") {
  Sentry.init({
    dsn: "https://b2949253b19698b31aaaee4c49d722f1@o4508911694315520.ingest.us.sentry.io/4508911777742848",
    integrations: [
      // Add our Profiling integration
    ],

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
}
