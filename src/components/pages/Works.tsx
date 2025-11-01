import React from 'react';

interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  tags: string[];
}

const works: Work[] = [
  {
    id: '1',
    title: '作品タイトル 1',
    description: '作品の説明がここに入ります。',
    tags: ['Web', 'React', 'TypeScript'],
  },
  {
    id: '2',
    title: '作品タイトル 2',
    description: '作品の説明がここに入ります。',
    tags: ['Design', 'UI/UX'],
  },
  {
    id: '3',
    title: '作品タイトル 3',
    description: '作品の説明がここに入ります。',
    tags: ['Mobile', 'React Native'],
  },
];

export default function Works() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">作品一覧</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {work.imageUrl && (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{work.title}</h2>
                <p className="text-gray-300 mb-4">{work.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {work.link && (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    詳細を見る
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

