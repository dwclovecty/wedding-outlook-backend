const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// ⭐ 加上 CORS（關鍵）
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ⭐ Outlook SMTP 設定
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS
  }
});

// 測試首頁
app.get('/', (req, res) => {
  res.send('Wedding Outlook Backend Running!');
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 寄信 API
app.post('/send-email', async (req, res) => {
  try {
    console.log("收到寄信請求");

    const { base64Photo } = req.body;

    if (!base64Photo || base64Photo.length < 100) {
      return res.status(400).json({ error: '無效的照片資料' });
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

    console.log("寄送成功");
    res.json({ success: true });

  } catch (err) {
    console.error('寄送錯誤:', err);
    res.status(500).json({ error: err.message });
  }
});

// ⭐ Render 必須使用 PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
