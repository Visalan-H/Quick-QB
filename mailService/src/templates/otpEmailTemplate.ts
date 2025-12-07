export const getOtpEmailTemplate = (otp: number): string => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                :root {
                    --gray-100: #f0f0f0;
                    --gray-200: #e0e0e0;
                    --gray-400: #b0b0b0;
                    --gray-900: #1e1e1e;
                    --gray-950: #121212;
                }

                body {
                    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.5;
                    color: #f0f0f0;
                    background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%),
                                radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
                                radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
                    background-color: #121212;
                    margin: 0;
                    padding: 20px;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #1e1e1e;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                }

                .header {
                    background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
                    color: #f0f0f0;
                    padding: 40px 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .header-subtitle {
                    margin: 10px 0 0 0;
                    font-size: 14px;
                    color: #b0b0b0;
                    opacity: 0.9;
                }

                .content {
                    padding: 40px 30px;
                    color: #e0e0e0;
                }

                .content p {
                    margin: 15px 0;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .otp-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    padding: 35px;
                    text-align: center;
                    margin: 35px 0;
                }

                .otp-label {
                    font-size: 12px;
                    color: #b0b0b0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                .otp-code {
                    font-size: 42px;
                    font-weight: 600;
                    color: #f0f0f0;
                    letter-spacing: 8px;
                    font-family: 'Courier New', monospace;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 15px;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .message {
                    text-align: center;
                    font-size: 13px;
                    color: #909090;
                    margin: 25px 0;
                    line-height: 1.7;
                }

                .expiry {
                    color: #e0e0e0;
                    font-weight: 600;
                }

                .warning {
                    background: rgba(255, 255, 255, 0.02);
                    border-left: 3px solid #707070;
                    padding: 12px 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #b0b0b0;
                }

                .footer {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 25px;
                    text-align: center;
                    font-size: 12px;
                    color: #707070;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .footer p {
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>QuickQB</h1>
                    <p class="header-subtitle">Email Verification</p>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for using QuickQB. Your one-time password (OTP) for email verification is shown below:</p>
                    
                    <div class="otp-box">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                    </div>

                    <div class="message">
                        <p>This code will expire in <span class="expiry">5 minutes</span>.</p>
                    </div>

                    <div class="warning">
                        <strong>Security Notice:</strong> Do not share this code with anyone. We will never ask for it via email.
                    </div>

                    <p>If you didn't request this code, you can safely ignore this email.</p>
                    <p>Best regards,<br><strong>Vizz</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 QuickQB. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
`;
