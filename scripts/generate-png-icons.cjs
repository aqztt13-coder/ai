const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function createPng(width, height, isMaskable = false) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Scanlines
  // Each scanline has 1 filter byte (0) + width * 4 bytes (RGBA)
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep Navy / Mesopotamian Midnight background
      let r = 13;
      let g = 33;
      let b = 55;
      let a = 255;

      // Outer gold circle ring
      if (dist >= maxR - 4 && dist <= maxR) {
        r = 245; g = 158; b = 11; // Gold
      } else if (dist < maxR - 4) {
        // Subtle gradient towards center
        const gradFactor = 1 - (dist / maxR) * 0.4;
        r = Math.min(255, Math.floor(18 * gradFactor));
        g = Math.min(255, Math.floor(45 * gradFactor));
        b = Math.min(255, Math.floor(75 * gradFactor));

        // Ziggurat icon representation in center
        // 3 stepped tiers
        const relY = y / height;
        const relX = x / width;

        // Tier 1 (bottom)
        if (relY >= 0.62 && relY <= 0.73 && Math.abs(relX - 0.5) < 0.28) {
          r = 217; g = 119; b = 6;
        }
        // Tier 2 (middle)
        else if (relY >= 0.51 && relY < 0.62 && Math.abs(relX - 0.5) < 0.20) {
          r = 245; g = 158; b = 11;
        }
        // Tier 3 (top)
        else if (relY >= 0.42 && relY < 0.51 && Math.abs(relX - 0.5) < 0.12) {
          r = 251; g = 191; b = 36;
        }
        // Shrine
        else if (relY >= 0.36 && relY < 0.42 && Math.abs(relX - 0.5) < 0.06) {
          r = 254; g = 240; b = 138;
        }
        // Central star above ziggurat
        else if (relY >= 0.22 && relY <= 0.32 && Math.abs(relX - 0.5) < 0.05) {
          r = 253; g = 230; b = 138;
        }
        // Water wave curve at base
        else if (relY >= 0.78 && relY <= 0.82 && Math.abs(relX - 0.5) < 0.32) {
          r = 14; g = 165; b = 233; // Sky blue
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Successfully generated all PWA PNG icon assets in /public');
