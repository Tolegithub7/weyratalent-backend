import { employerProfileRouter } from "@/routes/employerProfile.routes";

import bodyParser from "body-parser";

import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { env } from "./common/utils/envConfig";
import { BACKEND_URL } from "./common/utils/generalUtils";
import { cvRouter, userRouter } from "./routes";
import { talentProfileRouter } from "./routes/talentProfile.routes";

const app: Express = express();
const logger = pino({ name: "server start" });

// Middleware
app.use(cors());
app.use(express.json());

app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/cv`, cvRouter);
app.use(`${env.BASE_API}/user`, userRouter);
app.use(openAPIRouter);

export { app, logger };
