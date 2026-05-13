import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router.js';
import { errorMiddleware } from '@/middlewares/error-middleware.js';

const app = express();

// const allowedOrigins = [
//   process.env.API_GATEWAY_ORIGIN,
//   process.env.CLIENT_ORIGIN,          // http://localhost:5000
//   process.env.SEARCH_SERVICE_ORIGIN,  // http://localhost:4000
// ].filter(Boolean); // removes undefined

// app.use(
//   cors({
//     origin(origin, callback) {
//       // allow server-to-server & tools like curl/postman
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(
//         new Error(`CORS blocked: ${origin} not allowed`)
//       );
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

app.use(express.json());
app.use(cookieParser());

// health
app.get('/', (_req, res) => {
  res.json({ message: 'Auth API running' });
});

// routes
app.use('/api', router);

// errors
app.use(errorMiddleware);

export default app;
