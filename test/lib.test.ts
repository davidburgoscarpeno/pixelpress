import { describe, it, expect } from 'vitest';
import { fitDimensions, resizeTo, rotatedDimensions, dominantColors, estimateBase64Size } from '../src/tools/lib';
describe('image helpers', () => {
  it('fit inside box keeps ratio', () => {
    expect(fitDimensions(2000, 1000, 800, 800)).toEqual({ w: 800, h: 400 });
    expect(fitDimensions(100, 50, 800, 800)).toEqual({ w: 100, h: 50 });
  });
  it('fit rejects bad input', () => expect(fitDimensions(0, 100, 100, 100)).toEqual({ w: 0, h: 0 }));
  it('resize by width keeps ratio', () => expect(resizeTo(2000, 1000, 500, null, true)).toEqual({ w: 500, h: 250 }));
  it('resize by height keeps ratio', () => expect(resizeTo(2000, 1000, null, 100, true)).toEqual({ w: 200, h: 100 }));
  it('resize without ratio uses both', () => expect(resizeTo(2000, 1000, 300, 300, false)).toEqual({ w: 300, h: 300 }));
  it('rotated dims swap at 90/270', () => {
    expect(rotatedDimensions(800, 600, 90)).toEqual({ w: 600, h: 800 });
    expect(rotatedDimensions(800, 600, 180)).toEqual({ w: 800, h: 600 });
    expect(rotatedDimensions(800, 600, -90)).toEqual({ w: 600, h: 800 });
  });
  it('dominant colors finds the strong bucket', () => {
    const data: number[] = [];
    for (let i = 0; i < 400; i++) data.push(255, 0, 0, 255); // red pixels
    for (let i = 0; i < 40; i++) data.push(0, 0, 255, 255); // few blue
    const top = dominantColors(data, 1)[0];
    expect(top).toMatch(/^#f/); // red channel high
  });
  it('base64 size estimate', () => expect(estimateBase64Size(300)).toBe(400));
});
