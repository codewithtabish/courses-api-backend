/** @format */

import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import { testConnection } from './config/dbconnection';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';
import { doSomeHeavyTask } from './utils/heavyTask';
import client, { Counter, Histogram } from 'prom-client';
import responseTime from 'response-time';
import { createLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const cpuLength = os.cpus().length;

app.use(express.json());
app.use(cors());

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const options = {
  transports: [
    new LokiTransport({
      host: 'http://127.0.0.1:3100',
    }),
  ],
};
const logger = createLogger(options);

// Create a Histogram to measure response time (in seconds)
const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_express_request_duration_seconds',
  help: 'Histogram of HTTP request response durations in seconds, categorized by HTTP method, status code, and route.',
  buckets: [0.1, 0.25, 0.5, 1, 2, 5, 10], // Define the buckets for response times (seconds)
  labelNames: ['method', 'status_code', 'route'], // Add labels for method, status code, and route
});

// Create a Counter to count the total number of requests
const httpRequestCount = new Counter({
  name: 'http_total_request_counts',
  help: 'Total number of HTTP requests received, categorized by HTTP method, status code, and route.',
  labelNames: ['method', 'status_code', 'route'], // Add labels for method, status code, and route
});

// Middleware to measure response time and increment request counter
app.use(
  responseTime((req: Request, res: Response) => {
    const responseDuration = res.get('X-Response-Time') || '0'; // Get the response time from the header

    // Record the response time with labels (method, status code, and route) to Prometheus
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        status_code: res.statusCode.toString(),
        route: req.path,
      },
      Number(responseDuration) / 1000 // Convert ms to seconds
    );

    // Increment the total request counter with labels (method, status code, and route)
    httpRequestCount.inc({
      method: req.method,
      status_code: res.statusCode.toString(),
      route: req.path,
    });
  })
);

// Middleware to measure response time using response-time
app.use(
  responseTime((req: Request, res: Response) => {
    const responseDuration = res.get('X-Response-Time') || '0'; // Get the response time from the header

    // Record the response time with labels (method, status code, and route) to Prometheus
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        status_code: res.statusCode.toString(),
        route: req.path,
      },
      Number(responseDuration) / 1000 // Convert ms to seconds
    );
  })
);

// Probe every 5th second.

// Ensure you connect to the database before starting the server
async function startServer() {
  try {
    await testConnection();
    console.log('✅ Database connected successfully');

    // Define the routes
    app.get('/', (req: Request, res: Response) => {
      logger.info('req came on / home route');

      res.status(200).json({
        status: true,
        message: 'Server is running',
        cpus: `Process ID: ${process.pid}`,
      });
    });

    app.get('/test', (req: Request, res: Response) => {
      logger.info('req came on / test route');
      res.status(200).json({
        status: true,
        message: 'Test route is working',
        cpus: `Process ID: ${process.pid}`,
      });
    });

    app.get('/slow', async (req: Request, res: Response) => {
      logger.info('req came on / slow route');

      try {
        const result = await doSomeHeavyTask();

        console.log(`[INFO]: Task completed - ${JSON.stringify(result)}`);
        res.status(200).json(result);
      } catch (error: any) {
        console.error(`[ERROR]: ${error.message}`);
        logger.error(error.message);
        res
          .status(500)
          .json({ message: 'An error occurred', error: error.message });
      } finally {
        console.timeEnd('doSomeHeavyTask'); // End timing and log the time taken
      }
    });

    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: true,
        message: 'Health check passed',
        cpus: `Process ID: ${process.pid}`,
      });
    });

    app.get('/metrics', async (req: Request, res: Response) => {
      try {
        res.setHeader('Content-Type', client.register.contentType);
        res.send(await client.register.metrics());
      } catch (error: any) {
        console.error(`[ERROR]: ${error.message}`);
        res
          .status(500)
          .json({ message: 'An error occurred', error: error.message });
      }
    });

    // Listen on the specified PORT
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

// Handling clustering if enabled
if (cluster.isPrimary) {
  console.log(`Primary process PID: ${process.pid}`);
  for (let i = 0; i < cpuLength; i++) {
    cluster.fork();
  }

  // Restart worker on exit
  cluster.on('exit', (worker) => {
    console.warn(`Worker PID ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Start server in worker processes
  startServer();
}
