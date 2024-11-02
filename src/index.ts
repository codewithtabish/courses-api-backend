/** @format */

import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import fs from 'fs';
import { data } from './data';
import { testConnection } from './config/dbconnection';
import url from 'url';
import { Users } from './models/course-model';
import { db } from './config/db';
import {
  SignupData,
  validateSignupData,
  ValidationResponse,
} from './validations/userValidation';

const PORT = process.env.PORT || 3000;

testConnection()
  .then(() => {
    // Start the server only if the connection is successful
    const server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.url === '/') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              status: true,
              message: 'this is home page',
            })
          );
        } else if (req.url === '/users') {
          const response = await db.select().from(Users);
          try {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                status: true,
                message: 'all users',
                data: response,
              })
            );
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({ status: false, message: 'error fetching users' })
            );
          }
        } else if (req.method === 'POST' && req.url === '/signup') {
          let body = '';

          // Listen for data chunks
          req.on('data', (chunk) => {
            body += chunk.toString(); // Convert Buffer to string
          });

          req.on('end', async () => {
            try {
              const data: SignupData = JSON.parse(body);
              const validation: ValidationResponse = validateSignupData(data);

              if (!validation.valid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    status: false,
                    message: validation.message,
                  })
                );
                return; // Exit to prevent further response
              }

              // Database insertion inside try-catch to handle errors
              try {
                const newUser = await db
                  .insert(Users)
                  .values({
                    name: data.name,
                    clerkId: data.clerkId,
                    email: data.email,
                    isStudent: data.isStudent,
                    isAdmin: data.isAdmin,
                  })
                  .returning({ id: Users.id }); // Returning all fields or specific ones if needed

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    status: true,
                    message: 'User created successfully',
                    user: newUser,
                  })
                );
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    status: false,
                    message: 'Error creating new user',
                    error: error.message,
                  })
                );
              }
            } catch (error) {
              // Handle JSON parsing error or other errors
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  status: false,
                  message: 'Invalid JSON format',
                })
              );
            }
          });
        } else if (req.url === '/comments') {
          res.end(JSON.stringify({ status: true, comments: data.comments }));
        } else if (req.url === '/contact') {
          res.end(
            JSON.stringify({
              status: true,
              message: 'This is the contact page',
            })
          );
        } else if (req.url == '/products') {
          res.writeHead(200, 'Content-Type:text/json');
          res.end(
            JSON.stringify({
              status: true,
              message: 'all products',
              data: [
                { id: 1, name: 'Apple Iphone 14', price: 10000 },
                { id: 2, name: 'Apple Iphone 13', price: 8000 },
              ],
            })
          );
        } else {
          res.statusCode = 302;
          res.setHeader('Location', '/');
          res.end();
        }
      }
    );

    server.listen(PORT, () =>
      console.log(`Server is listening on PORT ${PORT}`)
    );
  })

  .catch((err) => {
    console.log('The Database connection error is ->', err);
    process.exit(1);
  });
