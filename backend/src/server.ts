import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AdminAuthRoutes from "./routes/admin.auth.routes";
import TreatmentRoutes from "./routes/treatments.routes";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json(), cookieParser());

app.use("/api/admin-auth/", AdminAuthRoutes);
app.use("/api/treatments/", TreatmentRoutes);

export default app;
