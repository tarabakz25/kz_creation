import type { APIRoute } from "astro";

const GITHUB_API_URL  = "https://api.github.com";

export const GET: APIRoute = async ({ url }) => {
  const UserName = url.searchParams.get("username");
  if(!UserName) {
    return new Response("username is required", { status: 400 });
  }
  const token = import.meta.env.GITHUB_TOKEN;

  if (!token) {
    return new Response("GitHub token is not set", { status: 500 });
  }

  const Now = new Date();
  const YearAgo = new Date(Now);

  YearAgo.setFullYear(Now.getFullYear() - 1);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        login: UserName,
        from: YearAgo.toISOString(),
        to: Now.toISOString(),
      },
    }),
  });

  if (!res.ok) {
    return new Response("Failed to fetch data from GitHub", { status: res.status });
  }

  const data = await res.json();

  if (data.errors) {
    return new Response(JSON.stringify(data.errors), { status: 500 });
  }

  const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;

  return new Response(JSON.stringify({
    totalContributions: data.data.user.contributionsCollection.contributionCalendar.totalContributions,
    weeks: weeks.map((week: any) => {
      return {
        contributionDays: week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
          weekday: day.weekday,
        })),
      }
    })
  })
};
