const db = require('../config/db');

const Metric = {
  async recordSnapshot(platformAccountId, metrics) {
    const { followers, following, likes, comments, shares, impressions, engagementRate } = metrics;
    const result = await db.query(
      `INSERT INTO metrics_snapshot
        (platform_account_id, followers, following, likes, comments, shares, impressions, engagement_rate)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [platformAccountId, followers, following, likes, comments, shares, impressions, engagementRate]
    );
    return result.rows[0];
  },

  async getTrend(platformAccountId, days = 30) {
    const result = await db.query(
      `SELECT * FROM metrics_snapshot
       WHERE platform_account_id = $1 AND recorded_at >= NOW() - ($2 || ' days')::interval
       ORDER BY recorded_at ASC`,
      [platformAccountId, days]
    );
    return result.rows;
  },

  async getLatest(platformAccountId) {
    const result = await db.query(
      `SELECT * FROM metrics_snapshot WHERE platform_account_id = $1
       ORDER BY recorded_at DESC LIMIT 1`,
      [platformAccountId]
    );
    return result.rows[0];
  },

  async getAccountsForUser(userId) {
    const result = await db.query(
      'SELECT * FROM platform_accounts WHERE user_id = $1 AND is_active = TRUE',
      [userId]
    );
    return result.rows;
  },
};

module.exports = Metric;
