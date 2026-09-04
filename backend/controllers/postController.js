const Post = require('../models/Post');
const socialApi = require('../services/socialApiService');

exports.createPost = async (req, res) => {
  try {
    const { platform, content, mediaUrl, scheduledFor, status } = req.body;

    if (!platform || !content || !scheduledFor) {
      return res.status(400).json({ message: 'platform, content and scheduledFor are required.' });
    }

    const post = await Post.create({
      userId: req.user.id,
      platform,
      content,
      mediaUrl,
      status: status || 'scheduled',
      scheduledFor,
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating post.' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { status, platform } = req.query;
    const posts = await Post.findAllByUser(req.user.id, { status, platform });
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching posts.' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, req.user.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching post.' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { content, mediaUrl, status, scheduledFor } = req.body;
    const post = await Post.update(req.params.id, req.user.id, { content, mediaUrl, status, scheduledFor });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating post.' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.delete(req.params.id, req.user.id);
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting post.' });
  }
};

// Manually trigger publish (for demo) instead of waiting for the cron job
exports.publishNow = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, req.user.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    await socialApi.publishPost({ platform: post.platform, content: post.content, mediaUrl: post.media_url });
    const updated = await Post.markPublished(post.id);

    res.json({ post: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error publishing post.' });
  }
};
