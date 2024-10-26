const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f2f4f6;
      color: #333333;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f2f4f6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .email-header {
      background-color: #4A90E2;
      padding: 20px;
      color: white;
      font-size: 24px;
    }
    .email-body {
      padding: 30px;
    }
    .email-body h1 {
      color: #333333;
      font-size: 22px;
      margin-bottom: 20px;
    }
    .email-body p {
      font-size: 16px;
      color: #555555;
      margin-bottom: 30px;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: #4A90E2;
      letter-spacing: 4px;
      margin-bottom: 30px;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #4A90E2;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #357ABD;
    }
    .email-footer {
      margin-top: 40px;
      padding: 20px;
      background-color: #f2f4f6;
      font-size: 12px;
      color: #888888;
    }
    .email-footer p {
      margin: 5px 0;
    }
    .email-footer a {
      color: #4A90E2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        Your OTP Code
      </div>
      <!-- Body -->
      <div class="email-body">
        <h1>Hello,</h1>
        <p>Thank you for signing up! To complete your registration, please use the one-time password (OTP) below. It is valid for the next 5 minutes.</p>
        <div class="otp-code">${otp}</div>
        <p>If you didn’t request this, please ignore this email or contact support.</p>
      </div>
      <!-- Footer -->
      <div class="email-footer">
        <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact our support team</a>.</p>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

module.exports = otpEmailTemplate;
