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
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: true,
        message: 'Server is running and this is health ',
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

startServer();
