import React, { useEffect, useState } from 'react';
import { fetchPosts, createPost, deletePost, publishPostNow } from '../services/api.js';

const STATUS_FILTERS = ['all', 'scheduled', 'published', 'draft'];

export default function Schedule() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ platform: 'twitter', content: '', scheduledFor: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = (status) => {
    setLoading(true);
    fetchPosts(status && status !== 'all' ? { status } : {})
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.content.trim() || !form.scheduledFor) {
      setError('Please write content and choose a date/time.');
      return;
    }
    setSubmitting(true);
    try {
      await createPost({ ...form, status: 'scheduled' });
      setForm({ platform: form.platform, content: '', scheduledFor: '' });
      load(filter);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not schedule post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    load(filter);
  };

  const handlePublishNow = async (id) => {
    await publishPostNow(id);
    load(filter);
  };

  const charLimit = form.platform === 'twitter' ? 280 : 2200;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Schedule</h1>
          <div className="sub">Compose once, publish everywhere — on your timeline.</div>
        </div>
      </div>

      <div className="composer-grid">
        <div className="panel">
          <div className="panel-header"><h3>New post</h3></div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="platform-picker">
              <button
                type="button"
                className={`platform-chip twitter${form.platform === 'twitter' ? ' active' : ''}`}
                onClick={() => setForm({ ...form, platform: 'twitter' })}
              >
                Twitter
              </button>
              <button
                type="button"
                className={`platform-chip instagram${form.platform === 'instagram' ? ' active' : ''}`}
                onClick={() => setForm({ ...form, platform: 'instagram' })}
              >
                Instagram
              </button>
            </div>

            <div className="field-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                rows={5}
                maxLength={charLimit}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={form.platform === 'twitter' ? "What's happening?" : 'Write a caption…'}
              />
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
                {form.content.length}/{charLimit}
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="mediaUrl">Media URL (optional)</label>
              <input
                id="mediaUrl"
                type="url"
                value={form.mediaUrl || ''}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>

            <div className="field-group">
              <label htmlFor="scheduledFor">Publish date &amp; time</label>
              <input
                id="scheduledFor"
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })}
              />
            </div>

            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Scheduling…' : 'Schedule post'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Your posts</h3>
          </div>
          <div className="tab-row">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`tab-btn${filter === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-shimmer" />
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="title">No posts here yet</div>
              Schedule one using the form on the left.
            </div>
          ) : (
            posts.map((post) => (
              <div className="post-list-item" key={post.id}>
                <div>
                  <div className="post-content-text">{post.content}</div>
                  <div className="post-meta">
                    {post.platform.toUpperCase()} · {new Date(post.scheduled_for).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`status-pill ${post.status}`}>{post.status}</span>
                  <div className="post-actions">
                    {post.status === 'scheduled' && (
                      <button className="icon-btn" onClick={() => handlePublishNow(post.id)}>Publish now</button>
                    )}
                    <button className="icon-btn danger" onClick={() => handleDelete(post.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
