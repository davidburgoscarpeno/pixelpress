// Pure tool logic, unit-tested and shared by the React components.
export function encodeUnicodeBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
export function decodeUnicodeBase64(s: string): string {
  const bin = atob(s.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
export function formatJson(input: string, indent = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent);
}
export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}
export function validateJson(input: string): { ok: boolean; msg: string } {
  try {
    const parsed = JSON.parse(input);
    const keys = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0;
    return { ok: true, msg: `Valid JSON. Top-level type: ${Array.isArray(parsed) ? 'array' : typeof parsed}${keys ? `, ${keys} keys` : ''}.` };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
