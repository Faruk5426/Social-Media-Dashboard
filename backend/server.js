require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const analyticsRoutes = require('./routes/analytics');
const Post = require('./models/Post');
const socialApi = require('./services/socialApiService');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// ---- Scheduler: checks every minute for posts due to publish ----
cron.schedule('* * * * *', async () => {
  try {
    const due = await Post.findDuePosts();
    for (const post of due) {
      await socialApi.publishPost({ platform: post.platform, content: post.content, mediaUrl: post.media_url });
      await Post.markPublished(post.id);
      console.log(`Auto-published scheduled post #${post.id} to ${post.platform}`);
    }
  } catch (err) {
    console.error('Scheduler error:', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Social Media Dashboard API running on port ${PORT}`);
});
