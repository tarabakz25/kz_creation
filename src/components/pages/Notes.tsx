import React from 'react';
import { FaArrowUpRightFromSquare, FaTag } from 'react-icons/fa6';

interface NoteEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  link?: string;
}

const notes: NoteEntry[] = [
  {
    id: 'note-2024-09-23',
    title: 'Astro 4への移行で得られた知見',
    date: '2024-09-23',
    summary: 'Astro 4へ移行する際にハマった点と、React Islandsを安定させるために行った調整を振り返ります。',
    tags: ['Astro', 'React', 'DX'],
    link: 'https://note.com/kz25_01/n/n1234567890ab',
  },
  {
    id: 'note-2024-07-12',
    title: 'LLMとデザインの協調ワークフロー',
    date: '2024-07-12',
    summary: 'FigmaとLLMを併用してUIプロトタイピングを高速化したプロセスを整理しました。',
    tags: ['LLM', 'Figma', 'Workflow'],
    link: 'https://note.com/kz25_01/n/n0987654321cd',
  },
  {
    id: 'note-2024-04-01',
    title: '競プロ視点で見るRustの魅力',
    date: '2024-04-01',
    summary: 'Rustを競技プログラミングで活用するメリットと、習得時に役立ったリソースを整理しています。',
    tags: ['Rust', 'Competitive Programming'],
  },
];

const Notes: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold">Notes</h1>
          <p className="text-gray-300 text-lg">
            個人的な学びや実験の記録です。現場での試行錯誤から得た知見を中心にまとめています。
          </p>
        </header>

        <section className="mt-12 space-y-8">
          {notes.map((note) => (
            <article
              key={note.id}
              className="bg-gray-800/80 backdrop-blur rounded-2xl border border-gray-800 shadow-lg hover:border-gray-700 transition-colors duration-300 p-8"
            >
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <time dateTime={note.date} className="uppercase tracking-widest">
                  {note.date}
                </time>
                <div className="flex flex-wrap items-center gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-gray-800/80 px-3 py-1 rounded-full"
                    >
                      <FaTag className="text-xs" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="mt-6 text-3xl font-semibold text-white">{note.title}</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">{note.summary}</p>

              {note.link && (
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  続きを読む
                  <FaArrowUpRightFromSquare className="text-xs" />
                </a>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Notes;
