import { useRef, useState } from 'react';
import { resizeTo, rotatedDimensions, dominantColors, estimateBase64Size } from './lib';

function kb(b: number) { return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`; }

function useImage() {
  const [file, setFile] = useState<File | null>(null);
  const [bmp, setBmp] = useState<ImageBitmap | null>(null);
  async function load(f: File | null) {
    setFile(f);
    setBmp(f ? await createImageBitmap(f) : null);
  }
  return { file, bmp, load };
}
function Uploader({ onFile }: { onFile: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return <input ref={ref} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />;
}
function DownloadBtn({ url, name }: { url: string; name: string }) {
  return <a className="btn" href={url} download={name} style={{ display: 'inline-block', marginTop: 8 }}>Download {name}</a>;
}
async function canvasOf(bmp: ImageBitmap, w: number, h: number, draw?: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  if (draw) draw(ctx); else ctx.drawImage(bmp, 0, 0, w, h);
  return c;
}
async function toUrl(c: HTMLCanvasElement, type = 'image/png', q?: number): Promise<{ url: string; size: number }> {
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, type, q));
  return blob ? { url: URL.createObjectURL(blob), size: blob.size } : { url: '', size: 0 };
}

export function ResizeTool() {
  const { file, bmp, load } = useImage();
  const [w, setW] = useState(''); const [h, setH] = useState(''); const [keep, setKeep] = useState(true);
  const [out, setOut] = useState<{ url: string; size: number; w: number; h: number } | null>(null);
  async function run() {
    if (!bmp) return;
    const dims = resizeTo(bmp.width, bmp.height, parseInt(w) || null, parseInt(h) || null, keep);
    const c = await canvasOf(bmp, dims.w, dims.h);
    const r = await toUrl(c);
    setOut({ ...r, ...dims });
  }
  return (
    <div className="panel">
      <Uploader onFile={load} />
      {bmp && <p>{file?.name}: {bmp.width}x{bmp.height} ({kb(file!.size)})</p>}
      <div className="btn-row">
        <label>Width (px)<br /><input type="number" value={w} onChange={(e) => setW(e.target.value)} style={{ maxWidth: 110 }} /></label>
        <label>Height (px)<br /><input type="number" value={h} onChange={(e) => setH(e.target.value)} style={{ maxWidth: 110 }} /></label>
        <label>Keep ratio<br /><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} /></label>
      </div>
      <button onClick={run} disabled={!bmp}>Resize</button>
      {out && <><p>Result: {out.w}x{out.h}, {kb(out.size)}</p><DownloadBtn url={out.url} name="resized.png" /></>}
    </div>
  );
}
export function ConvertTool() {
  const { file, bmp, load } = useImage();
  const [fmt, setFmt] = useState('image/webp');
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);
  async function run() {
    if (!bmp) return;
    const c = await canvasOf(bmp, bmp.width, bmp.height, (ctx) => {
      if (fmt === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, bmp.width, bmp.height); }
      ctx.drawImage(bmp, 0, 0);
    });
    setOut(await toUrl(c, fmt, 0.92));
  }
  const ext = fmt.split('/')[1].replace('jpeg', 'jpg');
  return (
    <div className="panel">
      <Uploader onFile={load} />
      {bmp && <p>{file?.name}: {kb(file!.size)}</p>}
      <label>Target format<br />
        <select value={fmt} onChange={(e) => setFmt(e.target.value)} style={{ width: 'auto' }}>
          <option value="image/webp">WebP</option><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option>
        </select></label>
      <div style={{ marginTop: 8 }}><button onClick={run} disabled={!bmp}>Convert</button></div>
      {out && <><p>Result: {kb(out.size)} (was {kb(file!.size)})</p><DownloadBtn url={out.url} name={`converted.${ext}`} /></>}
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>JPEG has no transparency - transparent areas become white. WebP usually gives the smallest files.</p>
    </div>
  );
}
export function CropTool() {
  const { file, bmp, load } = useImage();
  const [x, setX] = useState('0'); const [y, setY] = useState('0'); const [w, setW] = useState(''); const [h, setH] = useState('');
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);
  async function run() {
    if (!bmp) return;
    const cx = Math.max(0, parseInt(x) || 0), cy = Math.max(0, parseInt(y) || 0);
    const cw = Math.min(parseInt(w) || bmp.width, bmp.width - cx), ch = Math.min(parseInt(h) || bmp.height, bmp.height - cy);
    if (cw <= 0 || ch <= 0) return;
    const c = await canvasOf(bmp, cw, ch, (ctx) => ctx.drawImage(bmp, cx, cy, cw, ch, 0, 0, cw, ch));
    setOut(await toUrl(c));
  }
  return (
    <div className="panel">
      <Uploader onFile={load} />
      {bmp && <p>{file?.name}: {bmp.width}x{bmp.height}</p>}
      <div className="btn-row">
        <label>X<br /><input type="number" value={x} onChange={(e) => setX(e.target.value)} style={{ maxWidth: 80 }} /></label>
        <label>Y<br /><input type="number" value={y} onChange={(e) => setY(e.target.value)} style={{ maxWidth: 80 }} /></label>
        <label>Width<br /><input type="number" value={w} onChange={(e) => setW(e.target.value)} placeholder={String(bmp?.width ?? '')} style={{ maxWidth: 90 }} /></label>
        <label>Height<br /><input type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder={String(bmp?.height ?? '')} style={{ maxWidth: 90 }} /></label>
      </div>
      <button onClick={run} disabled={!bmp}>Crop</button>
      {out && <><p>Cropped: {kb(out.size)}</p><DownloadBtn url={out.url} name="cropped.png" /></>}
    </div>
  );
}
export function RotateTool() {
  const { bmp, load } = useImage();
  const [deg, setDeg] = useState(90); const [flipH, setFlipH] = useState(false); const [flipV, setFlipV] = useState(false);
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);
  async function run() {
    if (!bmp) return;
    const dims = rotatedDimensions(bmp.width, bmp.height, deg);
    const c = await canvasOf(bmp, dims.w, dims.h, (ctx) => {
      ctx.translate(dims.w / 2, dims.h / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(bmp, -bmp.width / 2, -bmp.height / 2);
    });
    setOut(await toUrl(c));
  }
  return (
    <div className="panel">
      <Uploader onFile={load} />
      <div className="btn-row">
        {[90, 180, 270].map((d) => <button key={d} className={deg === d ? '' : 'secondary'} onClick={() => setDeg(d)}>{d}°</button>)}
        <label>Flip horizontal<br /><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} /></label>
        <label>Flip vertical<br /><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} /></label>
      </div>
      <button onClick={run} disabled={!bmp}>Apply</button>
      {out && <><p>Done: {kb(out.size)}</p><DownloadBtn url={out.url} name="rotated.png" /></>}
    </div>
  );
}
export function Base64Tool() {
  const { file, load } = useImage();
  const [b64, setB64] = useState('');
  async function run(f: File | null) {
    load(f);
    if (!f) { setB64(''); return; }
    const buf = new Uint8Array(await f.arrayBuffer());
    let bin = '';
    const CH = 8192;
    for (let i = 0; i < buf.length; i += CH) bin += String.fromCharCode(...buf.subarray(i, i + CH));
    setB64(btoa(bin));
  }
  const dataUrl = file ? `data:${file.type};base64,${b64}` : '';
  return (
    <div className="panel">
      <Uploader onFile={run} />
      {file && b64 && <>
        <p>{file.name}: {kb(file.size)} binary, ~{kb(estimateBase64Size(file.size))} as Base64 (33% larger)</p>
        <label>Data URL</label>
        <textarea rows={6} readOnly value={dataUrl} onFocus={(e) => e.target.select()} />
        <div className="btn-row"><button className="secondary" onClick={() => navigator.clipboard.writeText(dataUrl)}>Copy data URL</button>
        <button className="secondary" onClick={() => navigator.clipboard.writeText(b64)}>Copy raw Base64</button></div>
      </>}
      <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Best for small images (icons, placeholders). For anything large, a normal file loads faster.</p>
    </div>
  );
}
export function PaletteTool() {
  const { bmp, load } = useImage();
  const [colors, setColors] = useState<string[]>([]);
  async function run(f: File | null) {
    await load(f);
    setColors([]);
  }
  async function extract() {
    if (!bmp) return;
    const max = 200;
    const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * r)), h = Math.max(1, Math.round(bmp.height * r));
    const c = await canvasOf(bmp, w, h);
    const data = c.getContext('2d')!.getImageData(0, 0, w, h).data;
    setColors(dominantColors(data, 8));
  }
  return (
    <div className="panel">
      <Uploader onFile={run} />
      <button onClick={extract} disabled={!bmp} style={{ marginTop: 8 }}>Extract palette</button>
      {colors.length > 0 && (
        <div className="tool-grid" style={{ marginTop: 12 }}>
          {colors.map((c) => (
            <div key={c} className="tool-card" style={{ textAlign: 'center' }}>
              <div style={{ background: c, height: 48, borderRadius: 6, border: '1px solid var(--border, #ddd)' }} />
              <p><code>{c}</code></p>
              <button className="secondary" onClick={() => navigator.clipboard.writeText(c)}>Copy</button>
            </div>))}
        </div>)}
    </div>
  );
}
export function FilterTool() {
  const { bmp, load } = useImage();
  const [filter, setFilter] = useState('grayscale(100%)');
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);
  async function run() {
    if (!bmp) return;
    const c = await canvasOf(bmp, bmp.width, bmp.height, (ctx) => {
      ctx.filter = filter;
      ctx.drawImage(bmp, 0, 0);
    });
    setOut(await toUrl(c));
  }
  const opts: [string, string][] = [['grayscale(100%)', 'Grayscale'], ['sepia(100%)', 'Sepia'], ['invert(100%)', 'Invert'], ['blur(4px)', 'Blur'], ['brightness(140%)', 'Brighten'], ['contrast(150%)', 'High contrast'], ['saturate(200%)', 'Saturate']];
  return (
    <div className="panel">
      <Uploader onFile={load} />
      <div className="btn-row" style={{ marginTop: 8 }}>
        {opts.map(([v, l]) => <button key={v} className={filter === v ? '' : 'secondary'} onClick={() => setFilter(v)}>{l}</button>)}
      </div>
      <button onClick={run} disabled={!bmp}>Apply filter</button>
      {out && <><p>Done: {kb(out.size)}</p><DownloadBtn url={out.url} name="filtered.png" /></>}
    </div>
  );
}
