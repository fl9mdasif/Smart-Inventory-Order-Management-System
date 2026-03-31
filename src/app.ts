/* eslint-disable @typescript-eslint/no-explicit-any */
// import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
// import { ImageUploads } from './app/modules/upload/route.upload';

const app: Application = express();

// parser middleware
app.use(express.json());
// app.use(cors());
// origin: 'http://localhost:5173', // Update with the actual origin of your frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://master.d1nc0rwrl0o6av.amplifyapp.com', // Your Amplify frontend
  'https://portfolio-dashboard-server-mongoose.vercel.app', // Your dashboard if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);



app.use(cookieParser());

// application routes
app.use('/api/v1', router);
// app.use('/api/v1/upload', ImageUploads);

app.get('/', (req: Request, res: Response) => {
  res.send('sultan-bazar-server is running....');
});


app.use(notFound);

// global err handler middleware. must declare it in the last off the file
app.use(globalErrorHandler);

export default app;
