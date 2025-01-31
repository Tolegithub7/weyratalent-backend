import express, {type Express} from "express"
import { pino } from "pino"
import cors from "cors"

const app: Express = express();
const logger = pino({ name: "server start" })
app.use(cors())
app.use(express.json())

export { app, logger }
