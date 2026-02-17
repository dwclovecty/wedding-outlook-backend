const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json({ limit: '10mb' }));

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS
  }
});

app.get('/', (req, res) => {
  res.send('Wedding Outlook Backend Running!');
});

app.post('/send-email', async (req, res) => {
  try {
    const { base64Photo } = req.body;

    if (!base64Photo) {
      return res.status(400).send('No photo provided');
    }

    await transporter.sendMail({
      from: process.env.OUTLOOK_USER,
      to: 'rgc4814ep67r98@print.epsonconnect.com',
      subject: 'Wedding Photo',
      text: 'Please print this photo.',
      attachments: [
        {
          filename: 'photo.jpg',
          content: base64Photo,
          encoding: 'base64'
        }
      ]
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(process.env.PORT || 3000);
