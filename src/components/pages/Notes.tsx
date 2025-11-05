import React, { useState, useEffect } from 'react';
import { FaArrowUpRightFromSquare, FaTag } from 'react-icons/fa6';

type Article = {
  title: string;
  url: string;
  publishedAt?: string;
}

const Notes: React.FC = () => {
  const [items, setItems] = useState<Article[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const r = await fetch('/api/articles.json', { credentials: "same-origin" });
        if (!r.ok) {
          const errorData = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
          if (!aborted) {
            setItems([]);
            setErr(errorData.error || `Failed to load articles (${r.status})`);
          }
          return;
        }
        
        const j = await r.json();
        console.log('API Response:', j); // デバッグ用

        if (aborted) return;
        if (j?.items && Array.isArray(j.items)) {
          setItems(j.items);
          setErr(null);
        } else {
          setItems([]);
          setErr(j?.error || '記事データが見つかりませんでした');
        }
      } catch (e) {
        if (!aborted) {
          console.error('Fetch error:', e);
          setItems([]);
          setErr(e instanceof Error ? e.message : 'An error occurred while fetching articles');
        }
      }
    })();

    return () => {
      aborted = true;
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl h-screen p-4 flex items-center justify-center">
      {err && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {err}
        </div>
      )}
      {items.length === 0 && !err && (
        <div className="text-sm text-gray-500">Loading...</div>
      )}
      <div className="flex flex-col gap-4">
        {items.map((it, i) => (
          <a href={it.url} target="_blank" rel="noopener noreferrer" className="border rounded-xl p-3 flex flex-col gap-2">
            <h1 className="main-fg">{it.title}</h1>
            {it.publishedAt ? (
              <span className="text-xs font-eurostile main-fg">
                {new Date(it.publishedAt).toLocaleDateString("ja-JP")}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Notes;
