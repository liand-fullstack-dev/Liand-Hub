export default async function handler(req, res) {
  const { SERVER_URL, API_KEY } = process.env;

  const url = `${SERVER_URL}${req.url.replace('/api/proxy', '')}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-device-id': req.headers['x-device-id'] || ''
      },
      body: ['POST', 'PUT', 'DELETE'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Proxy error'
    });
  }
}
