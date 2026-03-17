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
    const body = JSON.stringify(req.body);

    // 1차 요청: redirect: 'manual'로 302 응답의 Location 헤더를 가져옴
    const firstResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      redirect: 'manual',
    });

    let gasResponse;

    if (firstResponse.status === 301 || firstResponse.status === 302) {
      // 리다이렉트 URL로 POST를 다시 전송 (body 유지)
      const redirectUrl = firstResponse.headers.get('location');
      gasResponse = await fetch(redirectUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } else {
      gasResponse = firstResponse;
    }

    const text = await gasResponse.text();
    console.log('Google Apps Script response:', text);

    return res.status(200).json({ result: 'success', gas: text });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}
