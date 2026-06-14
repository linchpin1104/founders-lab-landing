// 솔라피 HMAC 서명 생성
async function generateSolapiSignature(apiKey, apiSecret) {
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 34);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(date + salt));
  const hexSignature = [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, '0')).join('');
  return { authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${hexSignature}` };
}

// 솔라피 문자 발송
async function sendSms(phone, name) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.warn('솔라피 API 키 미설정 — 문자 발송 건너뜀');
    return;
  }

  // 전화번호 정리 (하이픈 제거)
  const cleanPhone = phone.replace(/-/g, '');

  const { authorization } = await generateSolapiSignature(apiKey, apiSecret);

  const message = {
    message: {
      to: cleanPhone,
      from: process.env.SOLAPI_SENDER || '05058165980',
      text: `[파운더스랩] ${name}님, 2기 신청 감사합니다!\n\n접수가 완료되었습니다.\n\n▶ 결제 링크\nhttps://smartstore.naver.com/sheventures/products/13632230349\n\n결제 완료 후 1-2일 내로 상세 안내를 드리겠습니다.\n궁금한 점은 이 번호로 문의해 주세요.`,
    },
  };

  try {
    const res = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: { 'Authorization': authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const result = await res.json();
    if (!res.ok) console.error('솔라피 발송 실패:', JSON.stringify(result));
    else console.log('솔라피 문자 발송 성공:', cleanPhone);
  } catch (err) {
    console.error('솔라피 발송 에러:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const d = req.body;

    // ── 1. Notion DB 저장 ──
    const baseProperties = {
      '이름':       { title:  [{ text: { content: d.name        || '' } }] },
      '연락처':     { rich_text: [{ text: { content: d.phone      || '' } }] },
      '이메일':     { rich_text: [{ text: { content: d.email      || '' } }] },
      '직무':       { rich_text: [{ text: { content: d.job        || '' } }] },
      '연차':       { rich_text: [{ text: { content: d.years      || '' } }] },
      '아이디어유무': { rich_text: [{ text: { content: d.hasIdea   || '' } }] },
      '아이디어설명': { rich_text: [{ text: { content: d.ideaDesc  || '' } }] },
      '참가목표':   { rich_text: [{ text: { content: d.goal       || '' } }] },
      '유입경로':   { rich_text: [{ text: { content: d.heardFrom  || '' } }] },
      '기수':       { rich_text: [{ text: { content: '2기' } }] },
    };

    const notionHeaders = {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    let response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: baseProperties,
      }),
    });

    // 기수 컬럼이 없으면 기수 빼고 재시도
    if (!response.ok) {
      const errResult = await response.json();
      const errMsg = JSON.stringify(errResult);
      if (errMsg.includes('기수')) {
        console.warn('기수 컬럼 없음 — 기수 제외 후 재시도');
        const { '기수': _, ...propertiesWithout } = baseProperties;
        response = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: notionHeaders,
          body: JSON.stringify({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: propertiesWithout,
          }),
        });
      }
    }

    const result = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(result));

    // ── 2. 솔라피 문자 발송 (Notion 저장 성공 후, 실패해도 신청은 유효) ──
    if (d.phone && d.name) {
      await sendSms(d.phone, d.name).catch(err => {
        console.error('SMS 발송 실패 (신청은 정상 처리됨):', err.message);
      });
    }

    return res.status(200).json({ result: 'success' });
  } catch (error) {
    console.error('Notion submit error:', error.message);
    return res.status(500).json({ result: 'error', message: error.message });
  }
}
