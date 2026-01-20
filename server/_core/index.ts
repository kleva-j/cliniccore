import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthCallbackRoutes } from "../authCallback";
import { appRouter as router } from "../routers";
import { serveStatic, setupVite } from "./vite";
import { createContext } from "./context";
import { createServer } from "node:http";
import { ENV } from "./env";

import express from "express";
import net from "node:net";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Supabase Auth callback routes (if Supabase is configured)
  if (ENV.supabaseUrl && ENV.supabaseAnonKey) {
    registerAuthCallbackRoutes(app);
  }

  // tRPC API
  app.use("/api/trpc", createExpressMiddleware({ router, createContext }));
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = Number.parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  return app;
}

// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}

// Export the app creation function for Vercel
export async function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Supabase Auth callback routes (if Supabase is configured)
  if (ENV.supabaseUrl && ENV.supabaseAnonKey) {
    registerAuthCallbackRoutes(app);
  }

  app.use("/api/trpc", createExpressMiddleware({ router, createContext }));
  serveStatic(app);
  return app;
}
