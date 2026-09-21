export interface ToolFaq { q: string; a: string }
export interface ToolExample { title: string; input?: string; output?: string; note?: string }
export interface Tool {
  slug: string; name: string; category: string; description: string;
  seoTitle: string; metaDescription: string; intro: string;
  howTo: string[]; examples: ToolExample[]; faqs: ToolFaq[];
  related: string[]; component: string; mode?: string; implemented: boolean; popular?: boolean;
}
export const tools: Tool[] = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'Compression',
    description: 'Compress JPG, PNG and WebP images locally. Compare size before and after.',
    seoTitle: 'Image Compressor - Compress Images Online, 100% Private | PixelPress',
    metaDescription: 'Free image compressor that runs entirely in your browser. Compress JPG, PNG and WebP, adjust quality, and download the smaller file. No uploads.',
    intro: 'Shrink image files without uploading them anywhere. Compression happens on your device with a quality slider so you control the trade-off.',
    howTo: ['Drop an image or pick one from your device.', 'Adjust the quality slider and watch the estimated size.', 'Download the compressed version.'],
    examples: [{ title: 'Typical photo', output: 'A 2.4 MB JPG photo usually lands around 300-600 KB at 80% quality with no visible difference on screen.' }],
    faqs: [
      { q: 'Are my images uploaded?', a: 'No. Compression uses the canvas API in your browser. Your images never leave your device.' },
      { q: 'Which format should I pick?', a: 'WebP is smallest for photos and graphics on the modern web; JPG is the safe classic; PNG keeps lossless quality and transparency.' }
    ],
    related: [],
    component: 'CompressTool',
    implemented: true,
    popular: true
  }
];
export const implementedTools = tools.filter((t) => t.implemented);
export const categories = [...new Set(tools.map((t) => t.category))];
export function bySlug(slug: string) { return tools.find((t) => t.slug === slug); }
