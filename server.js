const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// 首頁測試
app.get('/', (req, res) => {
  res.send('Wedding Brevo Backend Running!');
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ⭐ 寄信 API
app.post('/send-email', async (req, res) => {
  try {
    console.log("收到寄信請求");

    const { base64Photo } = req.body;

    if (!base64Photo || base64Photo.length < 100) {
      return res.status(400).json({ error: '無效的照片資料' });
    }

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "Wedding App",
          email: process.env.EMAIL_USER
        },
        to: [
          {
            email: process.env.EPSON_EMAIL,
            name: "Printer"
          }
        ],
        subject: "Wedding Photo",
        htmlContent: "<p>Please print this photo.</p>",
        attachment: [
          {
            name: "photo.jpg",
            content: base64Photo
          }
        ]
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("寄送成功:", response.data);
    res.json({ success: true });

  } catch (err) {
    console.error("寄送錯誤:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
