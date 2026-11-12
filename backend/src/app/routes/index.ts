import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.routes";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.routes";
import { DoctorRoutes } from "../module/doctor/doctor.routes";
import { AdminRoutes } from "../module/admin/admin.routes";
import { scheduleRoutes } from "../module/schedule/schedule.routes";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.routes";
import { AppointmentRoutes } from "../module/appointment/appointment.routes";
import { PatientRoutes } from "../module/patient/patient.routes";
import { PrescriptionRoutes } from "../module/prescription/prescription.routes";
import { ReviewRoutes } from "../module/review/review.routes";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/specialties", SpecialtyRoutes);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoutes);
router.use("/patients", PatientRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/doctor-schedules", DoctorScheduleRoutes);
router.use("/appointments", AppointmentRoutes);
router.use("/prescriptions", PrescriptionRoutes);
router.use("/reviews", ReviewRoutes);

export const IndexRoutes = router;
