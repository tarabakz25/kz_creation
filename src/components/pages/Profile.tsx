import React from 'react';
import { FiAward } from "react-icons/fi";

import {
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import ProfileIcon from '~/assets/images/u3629887153_a_short-haired_anime_boy_sitting_wearing_a_black__7ac53e52-ff93-4e02-8942-30490f55db56_0.png?url';

type ToolItem = {
  name: string;
  score: number;
};

type ToolCategory = {
  name: string;
  items: ToolItem[];
};

const toolCategories: ToolCategory[] = [
  {
    name: 'Frameworks',
    items: [
      { name: 'Next.js', score: 80 },
      { name: 'Astro', score: 80 },
      { name: 'React', score: 75 },
      { name: 'TailwindCSS', score: 90 },
    ],
  },
  {
    name: 'Dev Tools',
    items: [
      { name: 'GitHub', score: 85 },
      { name: 'Neovim', score: 70 },
      { name: 'Cursor', score: 95 },
      { name: 'Vercel', score: 80 },
      { name: 'AWS', score: 35 },
      { name: 'Supabase', score: 75 },
    ],
  },
  {
    name: 'Design',
    items: [
      { name: 'Figma', score: 90 },
      { name: 'Photoshop', score: 40 },
      { name: 'Illustrator', score: 40 },
    ],
  },
];

const awards = [
  "Kosen Programming Contest 2025 Competitive Programming Division  - 3rd place in the semifinals",
  "TwoGate DevCamp 2024 - TwoGate Award",
]

const CHART_HEIGHT = 240;
const CHART_WIDTH = 280;
const SCORE_DOMAIN: [number, number] = [0, 100];

const chartColors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

const Profile: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-16 ">
      <div className="flex items-center justify-center gap-8">
        {awards.map((award, index) => (
          <div key={index} className="flex items-center gap-2 main-fg">
            <FiAward className="w-6 h-auto" />
            <span className="w-64 font-futura text-lg font-bold">{award}</span>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-center gap-8">
        <img src={ProfileIcon} alt="profile icon" className="w-48 h-48 object-cover rounded-3xl" />
        <div className="flex flex-col main-fg gap-2">
          <h1 className="text-3xl font-futura">Kizuki Aiki</h1>
          <h2 className="text-xl font-eurostile tracking-widest">Web Engineering, UI/UX Design and AI/LLM Coding</h2>
        </div>
      </div>
      <div className="w-full flex flex-nowrap items-start justify-center gap-12 overflow-x-auto pb-4 main-fg">
        {toolCategories.map((category, index) => {
          const chartData = category.items.map((item) => ({
            tool: item.name,
            score: item.score,
          }));
          const color = chartColors[index % chartColors.length];

          return (
            <div
              key={category.name}
              className="flex flex-col items-center gap-4 flex-shrink-0"
              style={{ width: CHART_WIDTH, minWidth: CHART_WIDTH, flexBasis: CHART_WIDTH }}
            >
              <div className="relative w-full" style={{ height: CHART_HEIGHT }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsRadarChart
                    data={chartData}
                    cx="50%"
                    cy="58%"
                    outerRadius="70%"
                    margin={{ top: 52, right: 16, bottom: 16, left: 16 }}
                  >
                    <PolarAngleAxis
                      dataKey="tool"
                      tick={{
                        fill: 'currentColor',
                        fontFamily: 'Eurostile, sans-serif',
                        fontSize: 12,
                        letterSpacing: '0.08em',
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      domain={SCORE_DOMAIN}
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Skill Level"
                      dataKey="score"
                      stroke={color}
                      fill={color}
                      strokeWidth={2}
                      fillOpacity={0.3}
                      dot={false}
                    />
                    <Tooltip
                      cursor={false}
                      formatter={(value: number) => [`${value}`, 'Score']}
                      labelFormatter={(label) => `${label}`}
                      wrapperClassName="text-xs main-fg"
                      contentStyle={{
                        backgroundColor: 'rgba(16,16,16,0.85)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--foreground)',
                      }}
                      />
                    </RechartsRadarChart>
                  </ResponsiveContainer>
                  <h3 className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 font-futura text-lg uppercase tracking-[0.2em]">
                    {category.name}
                  </h3>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}


export default Profile;
