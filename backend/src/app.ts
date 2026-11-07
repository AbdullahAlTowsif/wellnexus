/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import { IndexRoutes } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from "cors";
import { envVars } from './app/config/env';
import qs from 'qs';
import { PaymentController } from './app/module/payment/payment.controller';
import cron from 'node-cron';
import { AppointmentService } from './app/module/appointment/appointment.service';

const app: Application = express();

// Set the query parser to use qs for parsing query strings
app.set("query parser", (str: string) => qs.parse(str));

// ejs setup
app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`));

// stripe webhook route
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);

app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
}));

// Use the toNodeHandler middleware to handle authentication routes (better-auth)
app.use("/api/auth", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Cron job to cancel unpaid appointments and payments that are not completed within 30 minutes of booking - calls the cancelUnpaidAppointments function from AppointmentService every 25 minutes
cron.schedule("*/25 * * * *", async () => {
    try {
        console.log("Running cron job to cancel unpaid appointments...");
        await AppointmentService.cancelUnpaidAppointments();
    } catch (error : any) {
        console.error("Error occurred while canceling unpaid appointments:", error.message);    
    }
})

app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('WellNexus Server is running!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;