import { employerProfileRouter } from "@/routes/employerProfile.routes";
import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { env } from "./common/utils/envConfig";
import { BACKEND_URL } from "./common/utils/generalUtils";
import { talentProfileRouter } from "./routes/talentProfile.routes";
import { employerProfileRouter } from "@/routes/employerProfile.routes";

const app: Express = express();
const logger = pino({ name: "server start" });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/employer_profile`, employerProfileRouter);
app.use(openAPIRouter);

export { app, logger };