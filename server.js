require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

app.get('/token', async (req, res) => {
  const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DIRECTLINE_SECRET}`
    }
  });

  const data = await response.json();
  res.send(data);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
