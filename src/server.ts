import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { openAPIRouter } from "./api-docs/openAPIRouter";

const app: Express = express();
const logger = pino({ name: "server start" });
app.use(cors());
app.use(express.json());
app.use(openAPIRouter);

export { app, logger };
