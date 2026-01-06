import cors from "cors";
import express from "express";
import { env } from "./config/.env";
import healthRouter from "./routes/health.routes";

const app = express();
const BASE_ROUTE = "/api/v1"

app.use(cors());
app.use(express.json());

app.use(`${BASE_ROUTE}/health`, healthRouter);

app.listen(env.PORT, () => {
    console.log("API running on PORT ", env.PORT);
});