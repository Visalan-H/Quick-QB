import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/database';
import { verifyEmail } from './controllers/otpController';

const app = express();
const PORT = process.env.PORT || 4000;

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

app.post('/send-otp', verifyEmail);

app.listen(PORT, () => {
    console.log(`Mail service running on port ${PORT}`);
});

export default app;
