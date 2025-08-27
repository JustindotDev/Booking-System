import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AdminAuthRoutes from "./routes/admin.auth.routes";
import TreatmentRoutes from "./routes/treatments.routes";
import SalonScheduleRoutes from "./routes/salon.chedule.routes";
import AppointmentsRoutes from "./routes/appointments.routes";
import ContactsRoutes from "./routes/contacts.info.routes";

const app: Application = express();

app.use(express.json({ limit: "2mb" })); // increase as needed
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json(), cookieParser());

app.use("/api/admin-auth/", AdminAuthRoutes);
app.use("/api/treatments/", TreatmentRoutes);
app.use("/api/schedule", SalonScheduleRoutes);
app.use("/api/appointments", AppointmentsRoutes);
app.use("/api/contacts_info", ContactsRoutes);

export default app;
