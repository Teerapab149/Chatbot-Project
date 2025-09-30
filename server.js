require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/token', async (req, res) => {
  try {
    const response = await fetch("https://directline.botframework.com/v3/directline/tokens/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.DIRECTLINE_SECRET,
        "Content-Type": "application/json"
      }
    });

    const json = await response.json();
    res.send({ token: json.token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating token");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
