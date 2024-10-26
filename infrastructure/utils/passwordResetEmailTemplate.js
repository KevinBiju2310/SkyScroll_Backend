const passwordResetEmailTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
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
      margin-bottom: 20px;
    }
    .reset-link {
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
      margin-top: 20px;
    }
    .reset-link:hover {
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
      <div class="email-header">
        Password Reset Request
      </div>
      <div class="email-body">
        <h1>Hello,</h1>
        <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
        <p>Please click on the link below to reset your password:</p>
        <a href="${resetLink}" class="reset-link">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="email-footer">
        <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact our support team</a>.</p>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = passwordResetEmailTemplate;
