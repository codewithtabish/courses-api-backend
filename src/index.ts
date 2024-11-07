/** @format */

import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response, NextFunction } from 'express';
import { testConnection } from './config/dbconnection';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const cpuLength = os.cpus().length;

// Check if the process is primary before logging
if (cluster.isPrimary) {
  console.log('Talha');
  console.log(`Primary process ID: ${process.pid}`);

  // Fork workers based on the number of CPU cores
  for (let i = 0; i < cpuLength; i++) {
    const worker = cluster.fork();
    console.log(`Forked worker with process ID: ${worker.process.pid}`);
  }

  // Restart worker if it crashes
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}. Forking a new worker...`
    );
    const newWorker = cluster.fork();
    console.log(`Forked new worker with process ID: ${newWorker.process.pid}`);
  });
} else {
  // Only the worker processes will start the server
  startServer();
}

app.use(express.json());
app.use(cors());

// Logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  next();
};

app.use(logger);

// Start the server function
async function startServer() {
  try {
    await testConnection();
    console.log('Database connected successfully');

    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        status: true,
        message: 'Server is running',
        cpus: 'The process Id is ' + process.pid,
      });
    });

    app.get('/test', (req: Request, res: Response) => {
      res.status(200).json({
        status: true,
        message: 'Server is running',
        cpus: 'The process Id is ' + process.pid,
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}
