const db = require('../config/db');

const Post = {
  async create({ userId, platform, content, mediaUrl, status, scheduledFor }) {
    const result = await db.query(
      `INSERT INTO scheduled_posts (user_id, platform, content, media_url, status, scheduled_for)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, platform, content, mediaUrl, status || 'scheduled', scheduledFor]
    );
    return result.rows[0];
  },

  async findAllByUser(userId, { status, platform } = {}) {
    let query = 'SELECT * FROM scheduled_posts WHERE user_id = $1';
    const params = [userId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (platform) {
      params.push(platform);
      query += ` AND platform = $${params.length}`;
    }
    query += ' ORDER BY scheduled_for ASC';

    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id, userId) {
    const result = await db.query(
      'SELECT * FROM scheduled_posts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  async update(id, userId, fields) {
    const { content, mediaUrl, status, scheduledFor } = fields;
    const result = await db.query(
      `UPDATE scheduled_posts SET
         content = COALESCE($1, content),
         media_url = COALESCE($2, media_url),
         status = COALESCE($3, status),
         scheduled_for = COALESCE($4, scheduled_for)
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [content, mediaUrl, status, scheduledFor, id, userId]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    await db.query('DELETE FROM scheduled_posts WHERE id = $1 AND user_id = $2', [id, userId]);
    return true;
  },

  async findDuePosts() {
    const result = await db.query(
      `SELECT * FROM scheduled_posts WHERE status = 'scheduled' AND scheduled_for <= NOW()`
    );
    return result.rows;
  },

  async markPublished(id) {
    const result = await db.query(
      `UPDATE scheduled_posts SET status = 'published', published_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Post;
