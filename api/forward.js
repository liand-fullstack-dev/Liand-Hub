
export default async function handler(req, res) {
  const railwayUrl = process.env.SERVER_URL; 
  const apiKey = process.env.API_KEY; 
  const route = req.query.route; 

  if (!route) return res.status(400).json({ error: "Route tidak valid" });

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'x-device-id': req.headers['x-device-id'] || 'unknown',
    'x-forwarded-for': clientIp 
  };

  try {
    const response = await fetch(`${railwayUrl}/api/${route}`, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal terhubung ke Server Utama" });
  }
}
