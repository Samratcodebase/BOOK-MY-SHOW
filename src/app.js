import express from "express";
import HealthCheckRouter from "./Routes/healthCheck.route.js";
import MoiveBookingRouter from "./Routes/moive.route.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/heath", HealthCheckRouter);
app.use("/api/v1/mba", MoiveBookingRouter);

export default app;
