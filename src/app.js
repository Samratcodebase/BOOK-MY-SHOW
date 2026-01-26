import express from "express";
import cors from "cors";
import HealthCheckRouter from "./Routes/healthCheck.route.js";
import MoiveBookingRouter from "./Routes/moive.route.js";
import TheatreRouter from "./Routes/theatre.route.js";
import UserRouter from "./Routes/user.route.js";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/v1/heath", HealthCheckRouter);
app.use("/api/v1/mba", MoiveBookingRouter);
app.use("/api/v1/mba", TheatreRouter);
app.use("/api/v1/auth", UserRouter);
export default app;
