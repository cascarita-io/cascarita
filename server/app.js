require("./instrument");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const path = require("path");
const Middlewares = require("./middlewares");
const { startMongoConnection } = require("./mongodb");
const StripeWebhooks = require("./routes/webhooks/stripe.webhooks");
const morgan = require("morgan");
const Sentry = require("@sentry/node");

const app = express();
app.use(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  StripeWebhooks,
);

app.set("port", process.env.SERVER_PORT || 3000);

app.get("/api/health", (req, res) => res.sendStatus(200));

app.use(cookieParser());

// Enable CORS before using the router
app.use(morgan("dev"));
// NOTE: BETTER SOLUTION BUT WE NEED TO NOT DISABLE
// CSP TO PREVENT XSS ATTACKS
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: `http://localhost:${app.get("port")}`,
    credentials: true,
  }),
);
const checkJwt = require("./checkJwt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DivisionController = require("./routes/division.routes")(checkJwt);
const FieldRoutes = require("./routes/field.routes")(checkJwt);
const GroupRoutes = require("./routes/group.routes")(checkJwt);
const LeagueRoutes = require("./routes/league.routes")(checkJwt);
const PlayerRoutes = require("./routes/player.routes")(checkJwt);
const SeasonRoutes = require("./routes/season.routes")(checkJwt);
const SurveyController = require("./routes/survey.routes")(checkJwt);
const TeamRoutes = require("./routes/team.routes")(checkJwt);
const UserRoutes = require("./routes/user.routes")(checkJwt);
const FormRoutes = require("./routes/form.routes")(checkJwt);
const AccountRoutes = require("./routes/account.routes")(checkJwt);
const EmailRoutes = require("./routes/email.routes")(checkJwt);
const S3Routes = require("./routes/s3.routes")(checkJwt);

// Protected routes (requires JWT authentication)
app.use("/api/divisions", DivisionController);
app.use("/api/fields", FieldRoutes);
app.use("/api/groups", GroupRoutes);
app.use("/api/leagues", LeagueRoutes);
app.use("/api/players", PlayerRoutes);
app.use("/api/seasons", SeasonRoutes);
app.use("/api/surveys", SurveyController);
app.use("/api/teams", TeamRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/forms", FormRoutes);
app.use("/api/accounts", AccountRoutes);
app.use("/api/email", EmailRoutes);
app.use("/api/images", S3Routes);

// // Error handler should be the last middleware used
// app.use(Middlewares.errorHandler);
Sentry.setupExpressErrorHandler(app);

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

startMongoConnection().catch(console.dir);
module.exports = app;
