import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-email-secret'];
  if (secret !== process.env.EMAIL_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { to, subject, html, from_address, from_name } = req.body;

  if (!to || !subject || !html) {
    return res.status(422).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    await transporter.sendMail({
      from: `"${from_name || 'Amic Invisible'}" <${from_address || process.env.SMTP_USERNAME}>`,
      to,
      subject,
      html,
    });

    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
