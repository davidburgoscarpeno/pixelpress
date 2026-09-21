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
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'Resize',
    description: 'Resize images to exact dimensions with optional aspect-ratio lock.',
    seoTitle: 'Image Resizer - Resize Photos Online Free | PixelPress',
    metaDescription: 'Free image resizer. Change image dimensions in your browser with aspect-ratio lock. No upload to any server - files stay on your device.',
    intro: 'Resize any image to exact pixel dimensions. With ratio lock on, set width and the height follows automatically.',
    howTo: ['Choose an image.', 'Enter the target width or height.', 'Download the resized PNG.'],
    examples: [{ title: '4000x3000 photo to blog width', output: '800x600 at a fraction of the file size.' }],
    faqs: [{ q: 'Is my image uploaded?', a: 'No. Everything runs in your browser with the Canvas API - the file never leaves your device.' }],
    related: ['image-compressor', 'image-cropper', 'image-converter'],
    component: 'ResizeTool', implemented: true, popular: true
  },
  {
    slug: 'image-converter',
    name: 'Image Converter',
    category: 'Convert',
    description: 'Convert between PNG, JPEG and WebP with size comparison.',
    seoTitle: 'Image Converter - PNG, JPEG, WebP Online Free | PixelPress',
    metaDescription: 'Free image converter. Convert images between PNG, JPEG and WebP in your browser. Private: no uploads, instant download.',
    intro: 'Convert images between PNG, JPEG and WebP instantly. WebP usually gives the smallest files; JPEG flattens transparency to white.',
    howTo: ['Choose an image.', 'Pick the target format.', 'Download the converted file.'],
    examples: [{ title: '3MB PNG screenshot to WebP', output: 'Typically 5-10x smaller at similar quality.' }],
    faqs: [
      { q: 'Does JPEG keep transparency?', a: 'No. Transparent pixels become white in JPEG - use PNG or WebP to keep alpha.' },
      { q: 'Is quality lost?', a: 'PNG is lossless; JPEG and WebP here use 92% quality, visually indistinguishable for photos.' }
    ],
    related: ['image-compressor', 'image-resizer'],
    component: 'ConvertTool', implemented: true, popular: true
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'Edit',
    description: 'Crop images to any rectangle by pixel coordinates.',
    seoTitle: 'Image Cropper - Crop Photos Online Free | PixelPress',
    metaDescription: 'Free image cropper. Crop images to any pixel rectangle in your browser. No upload, instant download.',
    intro: 'Cut out exactly the region you need: set X, Y, width and height, and download the cropped image.',
    howTo: ['Choose an image.', 'Set the top-left corner (X, Y) and the size of the crop.', 'Download the cropped PNG.'],
    examples: [{ title: 'Cut a 500x500 avatar from a photo', output: 'X 750, Y 200, 500x500.' }],
    faqs: [{ q: 'Coordinates origin?', a: 'X and Y start at the top-left corner of the image (0, 0).' }],
    related: ['image-resizer', 'image-rotate-flip'],
    component: 'CropTool', implemented: true
  },
  {
    slug: 'image-rotate-flip',
    name: 'Rotate and Flip Image',
    category: 'Edit',
    description: 'Rotate 90, 180 or 270 degrees and flip horizontally or vertically.',
    seoTitle: 'Rotate Image Online - Flip Horizontally or Vertically | PixelPress',
    metaDescription: 'Free image rotator. Rotate images 90, 180 or 270 degrees and flip horizontally or vertically, right in your browser.',
    intro: 'Fix sideways photos and mirror images: rotate in 90-degree steps and flip on either axis.',
    howTo: ['Choose an image.', 'Pick the rotation and optional flips.', 'Download the result.'],
    examples: [{ title: 'Phone photo rotated sideways', output: 'Rotate 90° to straighten it.' }],
    faqs: [{ q: 'Does rotation lose quality?', a: 'No. The image is redrawn losslessly to a PNG at exact new dimensions.' }],
    related: ['image-cropper', 'image-filters'],
    component: 'RotateTool', implemented: true
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    category: 'Convert',
    description: 'Convert images to Base64 data URLs for CSS and HTML embedding.',
    seoTitle: 'Image to Base64 Converter - Data URL Generator | PixelPress',
    metaDescription: 'Free image to Base64 converter. Turn images into Base64 data URLs for CSS, HTML and JSON. Private: conversion happens in your browser.',
    intro: 'Embed small images directly in CSS or HTML as data URLs. Copy the full data URL or the raw Base64 string.',
    howTo: ['Choose an image.', 'Copy the data URL or raw Base64.', 'Paste into your CSS url() or img src.'],
    examples: [{ title: 'Icon in CSS', output: 'background: url(data:image/png;base64,iVBOR...)' }],
    faqs: [{ q: 'When should I avoid Base64?', a: 'For anything large: Base64 inflates size by 33% and blocks caching. Use it for icons and tiny placeholders only.' }],
    related: ['image-converter', 'image-compressor'],
    component: 'Base64Tool', implemented: true
  },
  {
    slug: 'color-palette-extractor',
    name: 'Color Palette Extractor',
    category: 'Color',
    description: 'Extract the dominant colors from any image as hex codes.',
    seoTitle: 'Color Palette Extractor - Get Colors from an Image | PixelPress',
    metaDescription: 'Free color palette extractor. Pull the dominant colors from any image as hex codes, ready to copy into your design tool.',
    intro: 'Grab the dominant colors of a photo, logo or screenshot as hex codes - perfect for matching a design to an image.',
    howTo: ['Choose an image.', 'Click Extract palette.', 'Copy any hex code with one click.'],
    examples: [{ title: 'Brand logo', output: 'The 6-8 dominant brand colors as hex codes.' }],
    faqs: [{ q: 'How does it work?', a: 'Pixels are sampled, grouped into color buckets and ranked by frequency. Transparent pixels are ignored.' }],
    related: ['image-filters', 'image-compressor'],
    component: 'PaletteTool', implemented: true
  },
  {
    slug: 'image-filters',
    name: 'Image Filters',
    category: 'Edit',
    description: 'Grayscale, sepia, invert, blur, brightness, contrast and saturation.',
    seoTitle: 'Image Filters Online - Grayscale, Sepia, Blur | PixelPress',
    metaDescription: 'Free online image filters. Apply grayscale, sepia, invert, blur, brightness, contrast and saturation filters in your browser.',
    intro: 'Apply classic photo filters without an editor: grayscale, sepia, invert, blur, brighten, high contrast and saturate.',
    howTo: ['Choose an image.', 'Pick a filter.', 'Download the filtered PNG.'],
    examples: [{ title: 'Profile photo in black and white', output: 'Grayscale filter, lossless PNG output.' }],
    faqs: [{ q: 'Can I combine filters?', a: 'Apply one, download, then re-upload the result and apply another.' }],
    related: ['image-rotate-flip', 'color-palette-extractor'],
    component: 'FilterTool', implemented: true
  }
];
export const implementedTools = tools.filter((t) => t.implemented);
export const categories = [...new Set(tools.map((t) => t.category))];
export function bySlug(slug: string) { return tools.find((t) => t.slug === slug); }
