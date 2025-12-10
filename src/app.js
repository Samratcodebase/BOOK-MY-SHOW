import express from "express";

import HealthCheckRouter from "./Routes/healthCheck.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use("/v1/heath", HealthCheckRouter);

export default app;
