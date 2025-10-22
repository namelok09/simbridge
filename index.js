const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTSX-oYbq0HdP8i_Rmb31AyICVqj79AfS5GIwiRRit-e6SwV0nKtA6ms7wmQw0HiAnOQ/exec';

// Trust proxy to handle HTTP/HTTPS
app.set('trust proxy', 1);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "online", timestamp: new Date().toISOString() });
});

// Main endpoint - accepts HTTP or HTTPS
app.get("/", async (req, res) => {
  const { temperature, humidity } = req.query;
  
  console.log(`[${new Date().toISOString()}] Received: temp=${temperature}, hum=${humidity}, protocol=${req.protocol}`);
  
  if (!temperature || !humidity) {
    console.log('Missing parameters');
    return res.status(400).send("Missing parameters: temperature and humidity required");
  }
  
  try {
    console.log('Forwarding to Google Sheets...');
    const response = await axios.get(
      `${GOOGLE_SCRIPT_URL}?temperature=${temperature}&humidity=${humidity}`,
      { timeout: 15000 }
    );
    
    console.log('✓ Success:', response.data);
    
    // Send simple success response
    res.status(200).send(JSON.stringify({
      status: "success",
      message: "Data added successfully",
      data: response.data
    }));
    
  } catch (e) {
    console.error('✗ Error:', e.message);
    res.status(500).send(`Error forwarding to Google: ${e.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Bridge running on port ${PORT}`);
  console.log('Ready to receive data from ESP8266');
});
```

---

### **STEP 4: Commit Changes**

1. Scroll down to the bottom
2. In the "Commit changes" box, type: `Accept HTTP requests`
3. Click the green **"Commit changes"** button

---

### **STEP 5: Wait for Render to Redeploy**

1. Go to your **Render Dashboard**: https://dashboard.render.com
2. Click on your **simbridge** service
3. You'll see it's **"Deploying..."** (watch the logs)
4. Wait until you see: **"Your service is live 🎉"** (takes 1-2 minutes)

You'll see logs like:
```
==> Cloning from https://github.com/...
==> Running 'npm install'...
==> Build successful 🎉
==> Deploying...
Bridge running on port 10000
Ready to receive data from ESP8266
==> Your service is live 🎉
