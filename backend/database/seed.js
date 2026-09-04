/**
 * Seeds the database with a demo user and a handful of scheduled posts
 * so the dashboard has something to show immediately.
 * Run with: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  const userResult = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ('Demo User', 'demo@pulse.dev', $1)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [passwordHash]
  );
  const userId = userResult.rows[0].id;

  await db.query(
    `INSERT INTO platform_accounts (user_id, platform, handle)
     VALUES ($1, 'twitter', 'demo_handle'), ($1, 'instagram', 'demo_handle')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  const samplePosts = [
    { platform: 'twitter', content: 'Excited to share our new product update! 🚀 #launch', hoursAhead: 4 },
    { platform: 'instagram', content: 'Behind the scenes from today\'s shoot ✨', hoursAhead: 26 },
    { platform: 'twitter', content: 'Weekly tips thread starting now 🧵', hoursAhead: 50 },
  ];

  for (const post of samplePosts) {
    const scheduledFor = new Date(Date.now() + post.hoursAhead * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO scheduled_posts (user_id, platform, content, status, scheduled_for)
       VALUES ($1, $2, $3, 'scheduled', $4)`,
      [userId, post.platform, post.content, scheduledFor]
    );
  }

  console.log('Seed complete.');
  console.log('Demo login -> email: demo@pulse.dev | password: Demo@1234');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
