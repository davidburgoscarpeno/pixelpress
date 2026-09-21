import { useRef, useState } from 'react';

function kb(bytes: number) { return `${(bytes / 1024).toFixed(0)} KB`; }

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function compress(f: File, q: number, type: string) {
    setBusy(true);
    try {
      const bmp = await createImageBitmap(f);
      const canvas = document.createElement('canvas');
      canvas.width = bmp.width; canvas.height = bmp.height;
      const ctx = canvas.getContext('2d')!;
      if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(bmp, 0, 0);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));
      if (blob) setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } finally { setBusy(false); }
  }
  function pick(f: File | null) {
    if (!f) return;
    setFile(f); setResult(null);
    compress(f, quality, format);
  }
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
  return (
    <div className="panel">
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => pick(e.target.files?.[0] ?? null)} />
      <div className="btn-row">
        <button onClick={() => inputRef.current?.click()}>{file ? 'Choose another image' : 'Choose an image'}</button>
        {file && <span style={{ color: 'var(--text-muted)' }}>{file.name} ({kb(file.size)})</span>}
      </div>
      {file && (
        <>
          <div className="btn-row" style={{ flexWrap: 'wrap' }}>
            <label>Quality: {Math.round(quality * 100)}%<br />
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => { const q = parseFloat(e.target.value); setQuality(q); compress(file, q, format); }} />
            </label>
            <label>Format<br />
              <select value={format} onChange={(e) => { setFormat(e.target.value); compress(file, quality, e.target.value); }} style={{ width: 'auto' }}>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
          </div>
          {busy && <p>Working...</p>}
          {result && (
            <>
              <p><strong>{kb(file.size)}</strong> → <strong className="ok">{kb(result.size)}</strong> ({Math.round((1 - result.size / file.size) * 100)}% smaller)</p>
              <a className="btn" href={result.url} download={`compressed.${ext}`} style={{ display: 'inline-block' }}>Download {ext.toUpperCase()}</a>
            </>
          )}
        </>
      )}
    </div>
  );
}
