import crypto from 'crypto';

const SPREADSHEET_ID = '1RlL4OR5oLQuCqaAVthlu9JG6tIVTvpR8yuvGx4xW26o';

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const toSign = `${header}.${claim}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(toSign);
  const signature = sign.sign(privateKey, 'base64url');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${toSign}.${signature}`,
    }),
  });

  const json = await tokenRes.json();
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;

    const koreaTime = new Date(data.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const row = [
      koreaTime,
      data.name        || '',
      data.phone       || '',
      data.email       || '',
      data.job         || '',
      data.years       || '',
      data.hasIdea     || '',
      data.ideaDesc    || '',
      data.goal        || '',
      data.heardFrom   || '',
    ];

    const accessToken = await getGoogleAccessToken();

    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A:J:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    const sheetsData = await sheetsRes.json();
    if (!sheetsRes.ok) throw new Error(JSON.stringify(sheetsData));

    return res.status(200).json({ result: 'success' });
  } catch (error) {
    console.error('Submit error:', error.message);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}
