// Pure helpers (testable); canvas work stays in components.
export function fitDimensions(w: number, h: number, maxW: number, maxH: number): { w: number; h: number } {
  if (w <= 0 || h <= 0 || maxW <= 0 || maxH <= 0) return { w: 0, h: 0 };
  const r = Math.min(maxW / w, maxH / h, 1);
  return { w: Math.round(w * r), h: Math.round(h * r) };
}
export function resizeTo(w: number, h: number, targetW: number | null, targetH: number | null, keepRatio: boolean): { w: number; h: number } {
  if (w <= 0 || h <= 0) return { w: 0, h: 0 };
  if (keepRatio) {
    if (targetW && targetW > 0) return { w: Math.round(targetW), h: Math.round((h / w) * targetW) };
    if (targetH && targetH > 0) return { w: Math.round((w / h) * targetH), h: Math.round(targetH) };
    return { w, h };
  }
  return { w: Math.max(1, Math.round(targetW ?? w)), h: Math.max(1, Math.round(targetH ?? h)) };
}
export function rotatedDimensions(w: number, h: number, deg: number): { w: number; h: number } {
  const d = ((deg % 360) + 360) % 360;
  return d === 90 || d === 270 ? { w: h, h: w } : { w, h };
}
// Dominant colors from raw RGBA bytes (buckets of 32 per channel), returns top hex colors
export function dominantColors(data: Uint8ClampedArray | number[], topN = 6): string[] {
  const buckets = new Map<number, number>();
  for (let i = 0; i + 3 < data.length; i += 16) { // sample every 4th pixel
    if (data[i + 3] < 128) continue;
    const key = (Math.floor(data[i] / 32) << 6) | (Math.floor(data[i + 1] / 32) << 3) | Math.floor(data[i + 2] / 32);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  return [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN).map(([key]) => {
    const r = ((key >> 6) & 7) * 32 + 16, g = ((key >> 3) & 7) * 32 + 16, b = (key & 7) * 32 + 16;
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  });
}
export function bytesToBase64Url(b64: string, mime: string): string { return `data:${mime};base64,${b64}`; }
export function estimateBase64Size(bytes: number): number { return Math.ceil(bytes / 3) * 4; }
