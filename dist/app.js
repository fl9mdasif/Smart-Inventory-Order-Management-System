"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// import 'dotenv/config';
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { ImageUploads } from './app/modules/upload/route.upload';
const app = (0, express_1.default)();
// parser middleware
app.use(express_1.default.json());
// app.use(cors());
// origin: 'http://localhost:5173', // Update with the actual origin of your frontend
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    // 'https://master.d1nc0rwrl0o6av.amplifyapp.com', 
    // 'https://portfolio-dashboard-server-mongoose.vercel.app', 
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use((0, cookie_parser_1.default)());
// application routes
app.use('/api/v1', routes_1.default);
// app.use('/api/v1/upload', ImageUploads);
app.get('/', (req, res) => {
    res.send('sultan-bazar-server is running....');
});
app.use(notFound_1.default);
// global err handler middleware. must declare it in the last off the file
app.use(globalErrorHandler_1.default);
exports.default = app;
