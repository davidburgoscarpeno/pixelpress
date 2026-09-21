import { useMemo, useState } from 'react';
import { implementedTools } from '../data/tools';

export default function Search({ placeholder }: { placeholder: string }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return implementedTools.filter(
      (t) => t.name.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle) || t.slug.includes(needle)
    ).slice(0, 8);
  }, [q]);
  return (
    <div className="search-wrap">
      <input
        type="text"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-label="Search tools"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {results.length > 0 && (
        <div className="search-results" role="listbox">
          {results.map((t) => (
            <a key={t.slug} href={`/${t.slug}`} role="option" aria-selected="false">
              {t.name}
              <small>{t.description}</small>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
