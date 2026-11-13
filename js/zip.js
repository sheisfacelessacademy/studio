/* ZIP sem compressão (suficiente para PNG, que já vêm comprimidos). */
const T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = (u) => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = T[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

/** files: [{ name, data: Uint8Array }] → Blob */
export function zip(files) {
  const enc = new TextEncoder(), parts = [], dir = [];
  let off = 0;
  files.forEach((f) => {
    const name = enc.encode(f.name), sum = crc(f.data), n = f.data.length;
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint32(14, sum, true); h.setUint32(18, n, true); h.setUint32(22, n, true); h.setUint16(26, name.length, true);
    parts.push(h.buffer, name, f.data);
    const d = new DataView(new ArrayBuffer(46));
    d.setUint32(0, 0x02014b50, true); d.setUint16(4, 20, true); d.setUint16(6, 20, true); d.setUint16(8, 0x0800, true);
    d.setUint32(16, sum, true); d.setUint32(20, n, true); d.setUint32(24, n, true); d.setUint16(28, name.length, true); d.setUint32(42, off, true);
    dir.push(d.buffer, name);
    off += 30 + name.length + n;
  });
  const dirSize = dir.reduce((a, b) => a + (b.byteLength ?? b.length), 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, dirSize, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...dir, e.buffer], { type: "application/zip" });
}
