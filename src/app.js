import express from "express";
import HealthCheckRouter from "./Routes/healthCheck.route.js";
import MoiveBookingRouter from "./Routes/moive.route.js";
import TheatreRouter from "./Routes/theatre .route.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/heath", HealthCheckRouter);
app.use("/api/v1/mba", MoiveBookingRouter);
app.use("/api/v1/theatre", TheatreRouter);

export default app;
