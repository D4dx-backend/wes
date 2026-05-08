const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const crypto = require('crypto');

const {
  DO_SPACES_KEY,
  DO_SPACES_SECRET,
  DO_SPACES_ENDPOINT,
  DO_SPACES_CDN_ENDPOINT,
  DO_SPACES_BUCKET,
  DO_SPACES_FOLDER,
} = process.env;

if (!DO_SPACES_KEY || !DO_SPACES_SECRET || !DO_SPACES_ENDPOINT || !DO_SPACES_BUCKET) {
  console.warn('[spaces] DigitalOcean Spaces credentials not fully configured');
}

const s3 = new S3Client({
  endpoint: DO_SPACES_ENDPOINT
    ? DO_SPACES_ENDPOINT.startsWith('http')
      ? DO_SPACES_ENDPOINT
      : `https://${DO_SPACES_ENDPOINT}`
    : undefined,
  region: 'us-east-1', // DO Spaces ignores this but SDK requires it
  credentials: {
    accessKeyId: DO_SPACES_KEY || '',
    secretAccessKey: DO_SPACES_SECRET || '',
  },
  forcePathStyle: false,
});

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIMES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP images and PDF files are allowed'));
  }
}

function makeKey(prefix, originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.bin';
  const folder = DO_SPACES_FOLDER ? `${DO_SPACES_FOLDER}/` : '';
  return `${folder}${prefix}/${crypto.randomUUID()}${ext}`;
}

function createUpload(prefix) {
  return multer({
    storage: multerS3({
      s3,
      bucket: DO_SPACES_BUCKET || '',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key(_req, file, cb) {
        cb(null, makeKey(prefix, file.originalname));
      },
    }),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  });
}

function getCdnUrl(key) {
  if (DO_SPACES_CDN_ENDPOINT) {
    return `${DO_SPACES_CDN_ENDPOINT.replace(/\/$/, '')}/${key}`;
  }
  return `${DO_SPACES_ENDPOINT}/${DO_SPACES_BUCKET}/${key}`;
}

async function deleteFile(key) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: DO_SPACES_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    console.error('[spaces] delete error:', err.message);
  }
}

// Extract the S3 key from a CDN URL
function keyFromUrl(url) {
  if (!url) return null;
  if (DO_SPACES_CDN_ENDPOINT && url.startsWith(DO_SPACES_CDN_ENDPOINT)) {
    return url.replace(DO_SPACES_CDN_ENDPOINT.replace(/\/$/, '') + '/', '');
  }
  const prefix = `${DO_SPACES_ENDPOINT}/${DO_SPACES_BUCKET}/`;
  if (url.startsWith(prefix)) {
    return url.replace(prefix, '');
  }
  return null;
}

const paymentScreenshotUpload = createUpload('payment-screenshots');
const qrImageUpload = createUpload('payment-qr');
const entryPassUpload = createUpload('entry-passes');

module.exports = {
  s3,
  paymentScreenshotUpload,
  qrImageUpload,
  entryPassUpload,
  getCdnUrl,
  deleteFile,
  keyFromUrl,
  createUpload,
};
