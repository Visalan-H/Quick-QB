# Mail Service Microservice

Email sending microservice for Quick-QB built with Express + TypeScript.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (use `.env.example` as template):

```env
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickqb
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL_VERCEL=https://quick-qb.vercel.app
BACKEND_URL=https://quick-qb.onrender.com
```

3. Build and run:

```bash
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## API Endpoints

### POST /generate-and-send-otp

Generate OTP, store in database, and send via email.

**Body:**

```json
{
    "email": "user@example.com"
}
```

**Response:**

```json
{
    "success": true,
    "message": "OTP sent successfully"
}
```

### POST /verify-otp

Verify OTP for user.

**Body:**

```json
{
    "email": "user@example.com",
    "otp": "1234"
}
```

**Response:**

```json
{
    "success": true,
    "message": "OTP verified successfully"
}
```

### GET /health

Health check endpoint.

## Backend Integration

Update backend `.env`:

```env
# Mail service no longer needed in backend - frontend calls it directly
```

## Frontend Integration

Update frontend `.env`:

```env
VITE_BASE_URL=http://localhost:3000
VITE_MAIL_SERVICE_URL=http://localhost:4000
```

For production:

```env
VITE_BASE_URL=https://quick-qb.onrender.com
VITE_MAIL_SERVICE_URL=https://your-mail-service.vercel.app
```
