import type { APIRoute } from "astro";

interface BlogPost {
  id: string;
  title: string;
  url: string;
  platform: 'note' | 'qiita';
  publishedAt: string;
  description?: string;
}

// Note APIから記事を取得する関数
async function fetchNotePosts(userId: string): Promise<BlogPost[]> {
  try {
    // Note APIの実装は公開APIがないため、RSSフィードやスクレイピングが必要
    // ここではモックデータを返す
    // 実際の実装では、RSSフィードのパースや公開APIを使用
    const response = await fetch(`https://note.com/${userId}/rss`);
    if (!response.ok) {
      return [];
    }
    // RSSフィードのパース処理が必要
    // 簡易実装としてモックデータを返す
    return [];
  } catch (error) {
    console.error('Failed to fetch Note posts:', error);
    return [];
  }
}

// Qiita APIから記事を取得する関数
async function fetchQiitaPosts(userId: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`https://qiita.com/api/v2/users/${userId}/items?per_page=10`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.map((item: any) => ({
      id: `qiita-${item.id}`,
      title: item.title,
      url: item.url,
      platform: 'qiita' as const,
      publishedAt: item.created_at.split('T')[0],
      description: item.body.substring(0, 200) + '...',
    }));
  } catch (error) {
    console.error('Failed to fetch Qiita posts:', error);
    return [];
  }
}

export const GET: APIRoute = async ({ url }) => {
  const noteUserId = url.searchParams.get("note_user") || "your-note-user-id";
  const qiitaUserId = url.searchParams.get("qiita_user") || "your-qiita-user-id";

  try {
    const [notePosts, qiitaPosts] = await Promise.all([
      fetchNotePosts(noteUserId),
      fetchQiitaPosts(qiitaUserId),
    ]);

    // 日付でソート（新しい順）
    const allPosts = [...notePosts, ...qiitaPosts].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return new Response(
      JSON.stringify({
        posts: allPosts,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch blog posts",
        posts: [],
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

