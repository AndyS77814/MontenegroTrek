// telegram-server.js (Node.js + Express)

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Сюда вставь свой токен и чат
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = '-1002296233031';
app.use(cors());
app.use(bodyParser.json());

app.post('/send-telegram', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) throw new Error('Telegram API error');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram send error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
app.post(`/webhook/${TELEGRAM_TOKEN}`, async (req, res) => {
  const body = req.body;

  // Проверка, что пришло текстовое сообщение
  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    console.log('📩 Получено сообщение от пользователя:', text);

    // Ответ пользователю
    const reply = `Вы написали: ${text}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });
  }

  res.sendStatus(200);
});
app.get('/', (req, res) => {
  res.send('🟢 Telegram server is running');
});
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});