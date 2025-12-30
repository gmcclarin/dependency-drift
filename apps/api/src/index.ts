import cors from "cors";
import express from "express";
import { env } from "./config/.env";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRouter);

app.listen(env.PORT, () => {
    console.log("API running on PORT ", env.PORT);
});