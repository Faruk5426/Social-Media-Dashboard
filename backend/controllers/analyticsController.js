const socialApi = require('../services/socialApiService');
const db = require('../config/db');

// Returns connected accounts for the user (creates demo ones on first call
// so the dashboard has data immediately after signup).
exports.getAccounts = async (req, res) => {
  try {
    let result = await db.query('SELECT * FROM platform_accounts WHERE user_id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      // Seed two demo-linked accounts (Twitter + Instagram) for a new user
      await db.query(
        `INSERT INTO platform_accounts (user_id, platform, handle) VALUES
           ($1, 'twitter', 'demo_handle'), ($1, 'instagram', 'demo_handle')`,
        [req.user.id]
      );
      result = await db.query('SELECT * FROM platform_accounts WHERE user_id = $1', [req.user.id]);
    }

    res.json({ accounts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching accounts.' });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const twitter = await socialApi.getProfile('twitter', 'demo_handle');
    const instagram = await socialApi.getProfile('instagram', 'demo_handle');

    const totalFollowers = twitter.followers + instagram.followers;
    const totalPosts = twitter.posts + instagram.posts;

    res.json({
      platforms: { twitter, instagram },
      totals: { followers: totalFollowers, posts: totalPosts },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching overview.' });
  }
};

exports.getTrend = async (req, res) => {
  try {
    const { platform = 'twitter' } = req.query;
    const days = parseInt(req.query.days, 10) || 30;
    const trend = await socialApi.getTrend(platform, 'demo_handle', days);
    res.json({ platform, trend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching trend data.' });
  }
};

exports.getEngagementBreakdown = async (req, res) => {
  try {
    const twitterTrend = await socialApi.getTrend('twitter', 'demo_handle', 7);
    const igTrend = await socialApi.getTrend('instagram', 'demo_handle', 7);

    const sum = (arr, key) => arr.reduce((acc, d) => acc + d[key], 0);

    res.json({
      breakdown: [
        { platform: 'Twitter', likes: sum(twitterTrend, 'likes'), comments: sum(twitterTrend, 'comments'), shares: sum(twitterTrend, 'shares') },
        { platform: 'Instagram', likes: sum(igTrend, 'likes'), comments: sum(igTrend, 'comments'), shares: sum(igTrend, 'shares') },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching engagement breakdown.' });
  }
};
