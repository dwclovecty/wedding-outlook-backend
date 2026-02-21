const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ⭐ 初始化 Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 測試首頁
app.get('/', (req, res) => {
  res.send('Wedding Resend Backend Running!');
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

    await resend.emails.send({
      from: 'Wedding Print <onboarding@resend.dev>',
      to: 'rgc4814ep67r98@print.epsonconnect.com',
      subject: 'Wedding Photo',
      html: '<p>Please print this photo.</p>',
      attachments: [
        {
          filename: 'photo.jpg',
          content: base64Photo,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
