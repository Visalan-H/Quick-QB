import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/database';
import { verifyEmail } from './controllers/otpController';
import dns from "dns";
import rateLimit from 'express-rate-limit';
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 4000;

const otpRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many OTP requests. Please try again later.' }
});

connectDB();

app.use(cors({
    origin: [
        process.env.FRONTEND_URL_VERCEL as string,
        process.env.FRONTEND_URL_CF as string,
    ],
    credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'mail-service' });
});

app.post('/send-otp', otpRequestLimiter, verifyEmail);

app.listen(PORT, () => {
    console.log(`Mail service running on port ${PORT}`);
});

export default app;
