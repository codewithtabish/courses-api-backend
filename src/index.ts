/** @format */

import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import fs from 'fs';
import { data } from './data';
import { testConnection } from './config/dbconnection';
import url from 'url';
import { db } from './config/db';
import { Users } from './models/course-model';

const PORT = process.env.PORT || 3000;

// Path to your data.txt file
const dataFilePath = './data.txt';

testConnection()
.catch((err) => {
  console.log('The Database connection error is ->', err);
  process.exit(1);
});

const checkValidation = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => {
  try {
    const checkName = url.parse(req?.url || '', true);
    console.log(checkName.query);
    if (checkName.query.name == 'zain') {
      console.log('You are allowed');
      next();
    }
  } catch (error) {}
};

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: true,
          message: 'this is home page',
          // data: ,
        })
      );
    } else if (req.url == '/users') {
      const response = await db.select().from(Users);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: true,
          message: 'all users',
          data: response,
        })
      );

      // return res.end(JSON.stringify({ status: true, users: data.users }));
    } else if (req.url === '/comments') {
      res.end(JSON.stringify({ status: true, comments: data.comments }));
    } else if (req.url === '/contact') {
      res.end(
        JSON.stringify({ status: true, message: 'This is the contact page' })
      );
    } else if (req.url === '/heavy-task') {
      try {
        // Synchronously read data from data.txt
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        res.end(JSON.stringify({ status: true, data: fileData.split('\n') }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            status: false,
            message: 'Error reading data',
            error: err.message,
          })
        );
      }
    } else {
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    }
  }
);

server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));