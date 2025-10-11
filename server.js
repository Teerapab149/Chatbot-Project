require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '.')));
app.use(cors());

// ✅ ใช้ fetch ที่มากับ Node ได้เลย (ไม่ต้อง require)
app.get('/token', async (req, res) => {
  try {
    const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DIRECTLINE_SECRET}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Direct Line token fetch failed:', text);
      return res.status(500).json({ error: 'Failed to fetch Direct Line token' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching token:', err);
    res.status(500).json({ error: 'Internal Server Error (token)' });
  }
});

// ✅ อ่านไฟล์ suggestion_questions.tsv
app.get('/suggestions', (req, res) => {
  const filePath = path.resolve(__dirname, 'suggestion_questions.tsv');
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ไม่พบไฟล์ suggestion_questions.tsv' });
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/).filter(l => l.trim());
    const grouped = {};

    for (const line of lines) {
      const [question, category] = line.split('\t');
      if (!question || !category) continue;
      const cleanCategory = category.trim();
      if (!grouped[cleanCategory]) grouped[cleanCategory] = [];
      grouped[cleanCategory].push(question.trim());
    }

    res.json(grouped);
  } catch (err) {
    console.error('Error reading suggestion file:', err);
    res.status(500).json({ error: 'ไม่สามารถอ่านไฟล์ suggestion_questions.tsv ได้' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
