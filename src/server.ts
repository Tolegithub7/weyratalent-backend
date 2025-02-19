import { employerProfileRouter } from "@/routes/employerProfile.routes";
<<<<<<< HEAD
=======

import bodyParser from "body-parser";

>>>>>>> upstream/main
import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { env } from "./common/utils/envConfig";
import { BACKEND_URL } from "./common/utils/generalUtils";
import { authRouter, cvRouter, userRouter } from "./routes";
import { talentProfileRouter } from "./routes/talentProfile.routes";

const app: Express = express();
const logger = pino({ name: "server start" });

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Routes
app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/employer_profile`, employerProfileRouter);
=======
app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/cv`, cvRouter);
app.use(`${env.BASE_API}/user`, userRouter);
app.use(`${env.BASE_API}/auth`, authRouter);
>>>>>>> upstream/main
app.use(openAPIRouter);

export { app, logger };