import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import { env } from "./common/utils/envConfig";
import { BACKEND_URL } from "./common/utils/generalUtils";
import { cvRouter } from "./routes";
import { talentProfileRouter } from "./routes/talentProfile.routes";

const app: Express = express();
const logger = pino({ name: "server start" });
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(`${env.BASE_API}/talent_profile`, talentProfileRouter);
app.use(`${env.BASE_API}/cv`, cvRouter);
app.use(openAPIRouter);

export { app, logger };
