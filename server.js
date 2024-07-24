const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Use JSON middleware to parse JSON request bodies
app.use(express.json());

// Function to get the current timestamp in the desired format
const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

app.post('/api/ad', async (req, res) => {
  const adId = req.body.adId;
  const timestamp = getCurrentTimestamp();
  const sessionId = 'rickjstest';
  const logs = [];

  const url = `https://integration.pre-us.citrusad.com/v1/resource/first-i/${adId}?sessionId=${sessionId}&event_ts=${timestamp}`;

  logs.push(`Current Timestamp: ${timestamp}`);
  logs.push(`API Call: ${url}`);

  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (response.ok) {
      logs.push(`Request succeeded with status: ${response.status}`);
      res.json({ message: 'Request succeeded', logs });
    } else {
      logs.push(`Request failed with status: ${response.status}`);
      res.status(response.status).json({ error: 'Request failed', logs });
    }
  } catch (error) {
    logs.push(`There was a problem with the fetch operation: ${error.message}`);
    res.status(500).json({ error: 'There was a problem with the fetch operation', logs });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
