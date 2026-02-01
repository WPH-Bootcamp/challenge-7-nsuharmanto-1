const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Aktifkan CORS untuk semua origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Geocode: area/city ke koordinat
app.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'foody-app/1.0 (your@email.com)' }
    });
    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Geocode proxy error:', err);
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
});

// Reverse geocode: koordinat ke area/city
app.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'foody-app/1.0 (nsuharmanto@gmail.com)' }
    });
    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Reverse proxy error:', err);
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
});

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'));