import { describe, it, expect } from 'vitest';
import { encodeUnicodeBase64, decodeUnicodeBase64, formatJson, minifyJson, validateJson } from '../src/tools/lib';

describe('base64 unicode', () => {
  it('encodes ASCII', () => expect(encodeUnicodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ=='));
  it('round-trips unicode', () => {
    const s = 'Hola ñ 👋 中文';
    expect(decodeUnicodeBase64(encodeUnicodeBase64(s))).toBe(s);
  });
  it('rejects invalid base64', () => expect(() => decodeUnicodeBase64('!!!notb64')).toThrow());
});
describe('json', () => {
  it('formats with indent', () => expect(formatJson('{"a":1}')).toBe('{\n  "a": 1\n}'));
  it('minifies', () => expect(minifyJson('{\n  "a": 1\n}')).toBe('{"a":1}'));
  it('validates ok', () => expect(validateJson('{"a":1}').ok).toBe(true));
  it('reports invalid', () => expect(validateJson('{"a":1,}').ok).toBe(false));
});
