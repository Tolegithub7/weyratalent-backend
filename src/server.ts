import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";

const app: Express = express();
const logger = pino({ name: "server start" });
app.use(cors());
app.use(express.json());

export { app, logger };
