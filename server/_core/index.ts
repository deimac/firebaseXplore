/**
 * Main server file
 * Initializes Express server and base middleware
 * Works in any environment
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { ENV, validateEnv, logEnvConfig } from './env.js';
import { appRouter } from '../routers.js';
import { createContext } from '../context.js';

// Validate environment on startup
validateEnv();
logEnvConfig();

const app: Express = express();

// Middleware: CORS
app.use(
  cors({
    origin: ENV.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware: JSON parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware: Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor = status >= 400 ? '❌' : '✅';
    console.log(`${statusColor} ${req.method} ${req.path} ${status} (${duration}ms)`);
  });
  next();
});

// Middleware: Serve static files (uploads)
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Route: Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.nodeEnv,
  });
});

// tRPC API endpoint
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// --- Static file serving for Frontend ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '../../../dist/public');

app.use(express.static(publicPath));

// SPA Catch-all: If a request is not for the API and not a static file, serve index.html.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Route: 404 - For API routes that are not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: ENV.isDevelopment ? err.message : undefined,
  });
});

// Export the configured app instance
export { app };
