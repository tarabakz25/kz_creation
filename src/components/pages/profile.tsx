import { useEffect, useState } from "react";
import RadarChart from "~/components/RadarChart";

interface ProfileData {
  name: string;
  headline: string;
  awards: string[];
  socials: Array<{
    platform: "x" | "github" | "website" | "linkedin";
    label: string;
    url: string;
  }>;
  toolCategories: Array<{
    name: string;
    items: Array<{
      name: string;
      score: number;
    }>;
  }>;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("/src/content/profile/kizuki-aiki.json")
      .then((res) => res.json())
      .then((profileData) => setData(profileData))
      .catch((err) => console.error("Failed to load profile data:", err));
  }, []);

  if (!data) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <div className="text-lg main-fg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-0">
      {/* Awards Section */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {data.awards.map((award, index) => (
          <div key={index} className="flex items-center gap-2 main-fg">
            {/* Award/Trophy Icon */}
            <svg
              className="w-5 sm:w-6 h-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6"></circle>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
            </svg>
            <span className="w-auto sm:w-64 font-futura text-base sm:text-lg font-bold text-center sm:text-left">
              {award}
            </span>
          </div>
        ))}
      </div>

      {/* Profile Info Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
        <img
          src="/src/assets/images/u3629887153_a_short-haired_anime_boy_sitting_wearing_a_black__7ac53e52-ff93-4e02-8942-30490f55db56_0.webp"
          alt="profile icon"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-2xl sm:rounded-3xl"
        />
        <div className="flex flex-col main-fg gap-2 items-center md:items-start">
          <h1 className="text-2xl sm:text-3xl font-futura">{data.name}</h1>
          <h2 className="text-base sm:text-lg md:text-xl font-eurostile tracking-widest text-center md:text-left">
            {data.headline}
          </h2>
          <div className="flex gap-2 pt-2">
            {data.socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                {social.platform === "x" && (
                  <svg
                    className="w-5 sm:w-6 h-auto"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social.platform === "github" && (
                  <svg
                    className="w-5 sm:w-6 h-auto"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Charts Section */}
      <div className="w-full flex flex-nowrap items-start justify-center gap-6 sm:gap-8 md:gap-12 overflow-x-auto pb-4 main-fg snap-x snap-mandatory scrollbar-hide">
        {data.toolCategories.map((category, index) => (
          <RadarChart
            key={index}
            category={category}
            color={chartColors[index % chartColors.length]}
          />
        ))}
      </div>
    </main>
  );
}
