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

const app: Application = express();

// Set the query parser to use qs for parsing query strings
app.set("query parser", (str: string) => qs.parse(str));

// ejs setup
app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`));

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


app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('WellNexus Server is running!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;