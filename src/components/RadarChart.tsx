import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  category: {
    name: string;
    items: Array<{
      name: string;
      score: number;
    }>;
  };
  color: string;
}

export default function CustomRadarChart({ category, color }: RadarChartProps) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[200px] sm:min-w-[250px] snap-center">
      <h3 className="font-eurostile text-sm sm:text-base font-bold tracking-wider">
        {category.name}
      </h3>
      <ResponsiveContainer width={200} height={200}>
        <RadarChart data={category.items}>
          <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: 'currentColor', fontSize: 10 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 8 }}
          />
          <Radar
            name={category.name}
            dataKey="score"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
