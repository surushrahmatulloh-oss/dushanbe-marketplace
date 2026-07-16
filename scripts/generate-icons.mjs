/**
 * Generate PWA / favicon PNGs (+ favicon.ico) from public/icon.svg
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svg = readFileSync(join(publicDir, "icon.svg"));

async function png(size, filename) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(publicDir, filename), buf);
  console.log(`wrote ${filename} (${size}x${size})`);
  return buf;
}

async function main() {
  await png(192, "icon-192.png");
  await png(512, "icon-512.png");
  await png(32, "favicon-32.png");
  await png(180, "apple-touch-icon.png");

  // Multi-size ICO (16 + 32) — PNG-compressed ICO entries
  const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  const icoBuf = buildIco([
    { size: 16, png: png16 },
    { size: 32, png: png32 },
  ]);
  writeFileSync(join(publicDir, "favicon.ico"), icoBuf);
  console.log("wrote favicon.ico");
}

/** Minimal ICO writer embedding PNG payloads (Vista+) */
function buildIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];
  const payloads = [];

  for (const img of images) {
    const png = img.png;
    entries.push({
      width: img.size >= 256 ? 0 : img.size,
      height: img.size >= 256 ? 0 : img.size,
      size: png.length,
      offset,
    });
    payloads.push(png);
    offset += png.length;
  }

  const buf = Buffer.alloc(offset);
  // ICONDIR
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2); // ICO
  buf.writeUInt16LE(count, 4);

  let entryAt = 6;
  for (const e of entries) {
    buf.writeUInt8(e.width, entryAt);
    buf.writeUInt8(e.height, entryAt + 1);
    buf.writeUInt8(0, entryAt + 2); // color palette
    buf.writeUInt8(0, entryAt + 3);
    buf.writeUInt16LE(1, entryAt + 4); // planes
    buf.writeUInt16LE(32, entryAt + 6); // bit count
    buf.writeUInt32LE(e.size, entryAt + 8);
    buf.writeUInt32LE(e.offset, entryAt + 12);
    entryAt += 16;
  }

  let dataAt = headerSize;
  for (const png of payloads) {
    png.copy(buf, dataAt);
    dataAt += png.length;
  }
  return buf;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
