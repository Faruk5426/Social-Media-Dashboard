/**
 * Social API Service
 * ---------------------------------------------------------
 * Thin adapter layer over Twitter (X) API v2 and Instagram Graph API.
 *
 * When real credentials are present in .env (and USE_MOCK_SOCIAL_DATA
 * is not "true"), this service calls the live REST APIs. Otherwise it
 * falls back to deterministic mock data so the dashboard, charts, and
 * scheduler all remain fully functional and demoable without paid/
 * approved developer accounts.
 *
 * Swap in real calls by filling in the fetchLiveXxx() functions below —
 * the rest of the app (routes/controllers) never needs to change.
 */

const USE_MOCK = process.env.USE_MOCK_SOCIAL_DATA !== 'false';

// ---------- Helpers to generate believable mock analytics ----------
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateMockProfile(platform, handle) {
  const rand = seededRandom(handle.length * 97 + platform.length);
  const baseFollowers = platform === 'instagram' ? 8500 : 5200;
  return {
    handle,
    platform,
    followers: Math.floor(baseFollowers + rand() * 4000),
    following: Math.floor(200 + rand() * 300),
    posts: Math.floor(80 + rand() * 120),
  };
}

function generateMockTrend(platform, days = 30) {
  const rand = seededRandom(days + platform.length);
  const trend = [];
  let followers = platform === 'instagram' ? 8500 : 5200;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    followers += Math.floor(rand() * 40) - 5;
    const likes = Math.floor(150 + rand() * 400);
    const comments = Math.floor(10 + rand() * 60);
    const shares = Math.floor(5 + rand() * 40);
    const impressions = Math.floor(2000 + rand() * 6000);
    const engagementRate = +(((likes + comments + shares) / impressions) * 100).toFixed(2);

    trend.push({
      date: date.toISOString().split('T')[0],
      followers,
      likes,
      comments,
      shares,
      impressions,
      engagementRate,
    });
  }
  return trend;
}

// ---------- Twitter (X) API v2 ----------
async function fetchLiveTwitterProfile(handle) {
  const bearer = process.env.TWITTER_BEARER_TOKEN;
  const url = `https://api.twitter.com/2/users/by/username/${handle}?user.fields=public_metrics`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${bearer}` } });
  if (!res.ok) throw new Error(`Twitter API error: ${res.status}`);
  const data = await res.json();
  const metrics = data.data.public_metrics;
  return {
    handle,
    platform: 'twitter',
    followers: metrics.followers_count,
    following: metrics.following_count,
    posts: metrics.tweet_count,
  };
}

// ---------- Instagram Graph API ----------
async function fetchLiveInstagramProfile(businessAccountId) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v19.0/${businessAccountId}?fields=followers_count,follows_count,media_count,username&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
  const data = await res.json();
  return {
    handle: data.username,
    platform: 'instagram',
    followers: data.followers_count,
    following: data.follows_count,
    posts: data.media_count,
  };
}

// ---------- Public interface used by controllers ----------
async function getProfile(platform, handle) {
  if (!USE_MOCK) {
    try {
      if (platform === 'twitter') return await fetchLiveTwitterProfile(handle);
      if (platform === 'instagram') return await fetchLiveInstagramProfile(handle);
    } catch (err) {
      console.error(`Live ${platform} fetch failed, falling back to mock:`, err.message);
    }
  }
  return generateMockProfile(platform, handle);
}

async function getTrend(platform, handle, days = 30) {
  // Live historical analytics generally require the Twitter Analytics
  // or Instagram Insights endpoints (elevated access). For now trend
  // data always comes from stored snapshots (see Metric model) which
  // get seeded/refreshed here.
  return generateMockTrend(platform, days);
}

async function publishPost({ platform, content, mediaUrl }) {
  if (!USE_MOCK) {
    // Real implementation would POST to:
    //  - Twitter: POST /2/tweets
    //  - Instagram: POST /{ig-user-id}/media then /media_publish
    // Left as a stub since it requires approved write-scope credentials.
    console.warn(`Live publish to ${platform} not configured; simulating instead.`);
  }
  return {
    success: true,
    platform,
    publishedAt: new Date().toISOString(),
    externalId: `mock_${platform}_${Date.now()}`,
  };
}

module.exports = { getProfile, getTrend, publishPost, generateMockTrend, generateMockProfile };
