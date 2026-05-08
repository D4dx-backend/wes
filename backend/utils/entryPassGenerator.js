const { createCanvas } = require('canvas');
const QRCode = require('qrcode');
const crypto = require('crypto');

const EVENT_NAME = 'WOMEN ENTREPRENEURS SUMMIT';
const EVENT_DATE = '20 June 2026';
const EVENT_VENUE = 'Manuelsons Malabar Palace, Calicut';

/**
 * Generate a unique short pass ID (8 chars uppercase)
 */
function generatePassId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

/**
 * Generate entry pass image as PNG Buffer
 * @param {object} opts
 * @param {string} opts.fullName - Attendee name
 * @param {string} opts.passId - Unique pass ID
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function generateEntryPass({ fullName, passId }) {
  const W = 1080;
  const H = 1400;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // --- Background gradient ---
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#0f0c29');
  bgGrad.addColorStop(0.5, '#302b63');
  bgGrad.addColorStop(1, '#24243e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // --- Decorative top accent bar ---
  const accentGrad = ctx.createLinearGradient(0, 0, W, 0);
  accentGrad.addColorStop(0, '#f857a6');
  accentGrad.addColorStop(1, '#ff5858');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, 0, W, 8);

  // --- Inner card ---
  const cardX = 60;
  const cardY = 60;
  const cardW = W - 120;
  const cardH = H - 120;
  const radius = 30;

  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.lineTo(cardX + cardW - radius, cardY);
  ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + radius, radius);
  ctx.lineTo(cardX + cardW, cardY + cardH - radius);
  ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH, radius);
  ctx.lineTo(cardX + radius, cardY + cardH);
  ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - radius, radius);
  ctx.lineTo(cardX, cardY + radius);
  ctx.arcTo(cardX, cardY, cardX + radius, cardY, radius);
  ctx.closePath();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- "ENTRY PASS" header ---
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 18px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.textAlign = 'center';
  ctx.fillText('E N T R Y   P A S S', W / 2, 130);

  // --- Event name ---
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'center';

  // Word wrap for event name
  const eventWords = EVENT_NAME.split(' ');
  let eventLine1 = '';
  let eventLine2 = '';
  const maxLineWidth = cardW - 80;

  for (const word of eventWords) {
    const testLine = eventLine1 ? eventLine1 + ' ' + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineWidth && eventLine1) {
      eventLine2 += (eventLine2 ? ' ' : '') + word;
    } else {
      eventLine1 = testLine;
    }
  }

  const eventY = 210;
  ctx.fillText(eventLine1, W / 2, eventY);
  if (eventLine2) {
    ctx.fillText(eventLine2, W / 2, eventY + 60);
  }

  // --- Divider line ---
  const divY = eventLine2 ? eventY + 100 : eventY + 50;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, divY);
  ctx.lineTo(cardX + cardW - 60, divY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Date & Venue ---
  const infoY = divY + 50;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '500 20px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('📅  ' + EVENT_DATE, W / 2, infoY);
  ctx.fillText('📍  ' + EVENT_VENUE, W / 2, infoY + 40);

  // --- Attendee name ---
  const nameY = infoY + 120;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 14px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('A T T E N D E E', W / 2, nameY);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText(fullName.toUpperCase(), W / 2, nameY + 50);

  // --- QR Code ---
  const qrY = nameY + 100;
  const qrSize = 300;
  const qrDataUrl = await QRCode.toDataURL(passId, {
    width: qrSize,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });

  // Draw QR background
  const qrBgX = (W - qrSize - 40) / 2;
  const qrBgY = qrY;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrBgX, qrBgY, qrSize + 40, qrSize + 40, 16);
  ctx.fill();

  // Draw QR code from data URL
  const { loadImage } = require('canvas');
  const qrImage = await loadImage(qrDataUrl);
  ctx.drawImage(qrImage, qrBgX + 20, qrBgY + 20, qrSize, qrSize);

  // --- Pass ID below QR ---
  const passIdY = qrY + qrSize + 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 14px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('P A S S   I D', W / 2, passIdY);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Courier New", Courier, monospace';
  ctx.fillText(passId, W / 2, passIdY + 40);

  // --- Footer ---
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '400 14px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText('Show this pass at the entrance for check-in', W / 2, H - 90);

  return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

module.exports = { generateEntryPass, generatePassId };
