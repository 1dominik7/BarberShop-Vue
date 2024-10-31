export const generateTemplate = (options) => {
  const { username, appointmentDate, serviceName, barberName, startTime } =
    options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
        .highlight {
            color: #007BFF;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our Barber Shop!</h1>
        </div>
        <p>Dear ${username},</p>
        <p>Thank you for choosing our barber shop for your grooming needs. We are excited to welcome you on <span class="highlight">${appointmentDate}</span>!</p>
        <p>Your appointment details are as follows:</p>
        <ul>
            <li><strong>Service:</strong> ${serviceName}</li>
            <li><strong>Barber:</strong> ${barberName}</li>
            <li><strong>Date & Time:</strong> ${appointmentDate} at ${startTime}</li>
            <li><strong>Location:</strong> Srebrna 11, Warsaw</li>
        </ul>
        <p>If you have any questions or need to make changes to your appointment, feel free to contact us!</p>
        <p>Looking forward to seeing you soon!</p>
        <p>Best regards,</p>
        <p>The Barber Shop Team</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sanber Barber Shop. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
