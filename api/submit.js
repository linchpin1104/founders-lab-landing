const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4pxA6_V7_Ugz7Cei0u__egrzo7DAqu1WnVMWTp6Oyy8l6tRQtyEcIt7_GVKvojTXZKQ/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow',
    });

    return res.status(200).json({ result: 'success' });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}
