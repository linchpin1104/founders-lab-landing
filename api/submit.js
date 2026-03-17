export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const d = req.body;

    const koreaTime = new Date(d.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          '이름':       { title:  [{ text: { content: d.name        || '' } }] },
          '연락처':     { rich_text: [{ text: { content: d.phone      || '' } }] },
          '이메일':     { rich_text: [{ text: { content: d.email      || '' } }] },
          '직무':       { rich_text: [{ text: { content: d.job        || '' } }] },
          '연차':       { rich_text: [{ text: { content: d.years      || '' } }] },
          '아이디어유무': { rich_text: [{ text: { content: d.hasIdea   || '' } }] },
          '아이디어설명': { rich_text: [{ text: { content: d.ideaDesc  || '' } }] },
          '참가목표':   { rich_text: [{ text: { content: d.goal       || '' } }] },
          '유입경로':   { rich_text: [{ text: { content: d.heardFrom  || '' } }] },
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(result));

    return res.status(200).json({ result: 'success' });
  } catch (error) {
    console.error('Notion submit error:', error.message);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}
