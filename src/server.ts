import cors from "cors";
import express, { type Express } from "express";
import { unless } from "express-unless";
import { StatusCodes } from "http-status-codes";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { authenticateMiddleware } from "./common/middleware/authenticationMiddleware";
import customErrorHandler from "./common/middleware/customErrorHandler";
import { ApiError } from "./common/models/serviceResponse";
import { env } from "./common/utils/envConfig";
import { BACKEND_URL } from "./common/utils/generalUtils";
import {
  appliedJobsRouter,
  authRouter,
  cvRouter,
  employerProfileRouter,
  favoriteJobsRouter,
  jobPostingRouter,
  logoutRouter,
  userRouter,
} from "./routes";
import { talentProfileRouter } from "./routes/talentProfile.routes";

const app: Express = express();
const logger = pino({ name: "server start" });
const auth = authenticateMiddleware as any;
auth.unless = unless;
const skipAuthPath = [
  "/swagger.json",
  "/swagger-ui.css",
  "/swagger-ui-bundle.js",
  "/swagger-ui-standalone-preset.js",
  "/swagger-ui-init.js",
  "/favicon-32x32.png",
  "/favicon.ico",
  "/",
  `${env.BASE_API}/auth/login`,
  `${env.BASE_API}/auth/refresh-token`,
  `${env.BASE_API}/user`,
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth.unless({ path: skipAuthPath }));
// Routes
app.use(`${env.BASE_API}/employer_profile`, employerProfileRouter);
app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/cv`, cvRouter);
app.use(`${env.BASE_API}/user`, userRouter);
app.use(`${env.BASE_API}/auth`, authRouter);
app.use(`${env.BASE_API}/job_posting`, jobPostingRouter);
app.use(`${env.BASE_API}/applied_jobs`, appliedJobsRouter);
app.use(`${env.BASE_API}/favorite_jobs`, favoriteJobsRouter);
app.use(`${env.BASE_API}/logout`, logoutRouter);
app.use(openAPIRouter);

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not Found"));
});

app.use(customErrorHandler());

export { app, logger };
