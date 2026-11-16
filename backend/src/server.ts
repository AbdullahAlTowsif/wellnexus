import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";

let server: Server;
const bootstrap = async () => {
    try {
        await seedSuperAdmin();
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// SIGTERM signal handler
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down server...");

    if (server) {
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// SIGINT signal handler
process.on("SIGINT", () => {
    console.log("SIGINT (Ctrl+C) signal received. Shutting down server...");

    if (server) {
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

//uncaught exception handler: such an error that is not caught by any try-catch block or error handler, and it causes the Node.js process to terminate. (error caused by any synchronous operation)
process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception Detected... Shutting down server", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// unhandled rejection handler: such an error that is not handled by any promise rejection handler, and it causes the Node.js process to terminate. (error caused by any asynchronous operation)
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected... Shutting down server", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

bootstrap();
