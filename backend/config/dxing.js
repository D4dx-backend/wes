const axios = require('axios');

const DXING_SECRET = process.env.DXING_API_KEY;
const DXING_ACCOUNT = process.env.DXING_INSTANCE_ID;
const DXING_BASE_URL = 'https://app.dxing.in/api';

if (!DXING_SECRET || !DXING_ACCOUNT) {
  console.warn('[dxing] Dxing API credentials not fully configured');
}

function normalizePhone(phoneNumber) {
  let phone = phoneNumber.replace(/[\s\-()]/g, '');
  if (phone.startsWith('+')) phone = phone.slice(1);
  if (!phone.startsWith('91') && phone.length === 10) phone = '91' + phone;
  return phone;
}

/**
 * Send a WhatsApp image message with caption via Dxing API
 */
async function sendWhatsAppImage(phoneNumber, imageUrl, caption) {
  if (!DXING_SECRET || !DXING_ACCOUNT) {
    throw new Error('Dxing API not configured');
  }

  const phone = normalizePhone(phoneNumber);

  const response = await axios.post(
    `${DXING_BASE_URL}/send/whatsapp`,
    {
      secret: DXING_SECRET,
      account: DXING_ACCOUNT,
      recipient: phone,
      type: 'media',
      message: caption,
      media_url: imageUrl,
      media_type: 'image',
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );

  const data = response.data;
  if (data && data.status !== 200) {
    throw new Error(`Dxing API error: ${JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Send a WhatsApp text message via Dxing API
 */
async function sendWhatsAppText(phoneNumber, message) {
  if (!DXING_SECRET || !DXING_ACCOUNT) {
    throw new Error('Dxing API not configured');
  }

  const phone = normalizePhone(phoneNumber);

  const response = await axios.post(
    `${DXING_BASE_URL}/send/whatsapp`,
    {
      secret: DXING_SECRET,
      account: DXING_ACCOUNT,
      recipient: phone,
      type: 'text',
      message,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );

  const data = response.data;
  if (data && data.status !== 200) {
    throw new Error(`Dxing API error: ${JSON.stringify(data)}`);
  }

  return data;
}

module.exports = { sendWhatsAppImage, sendWhatsAppText };
