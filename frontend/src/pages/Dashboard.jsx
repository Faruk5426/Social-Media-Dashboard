import React, { useEffect, useState } from 'react';
import { fetchOverview, fetchTrend, fetchEngagement, fetchPosts } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import MetricCard from '../components/MetricCard.jsx';
import PulseTicker from '../components/PulseTicker.jsx';
import GrowthChart from '../components/GrowthChart.jsx';
import EngagementChart from '../components/EngagementChart.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [engagement, setEngagement] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchOverview(),
      fetchTrend('twitter', 30),
      fetchEngagement(),
      fetchPosts({ status: 'scheduled' }),
    ])
      .then(([ov, tr, eng, posts]) => {
        if (!mounted) return;
        setOverview(ov.data);
        setTrend(tr.data.trend);
        setEngagement(eng.data.breakdown);
        setUpcoming(posts.data.posts.slice(0, 4));
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Dashboard</h1></div>
        <div className="loading-shimmer" style={{ marginBottom: 20 }} />
        <div className="loading-shimmer" />
      </div>
    );
  }

  const tw = overview.platforms.twitter;
  const ig = overview.platforms.instagram;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <div className="sub">Here's how your channels are performing today.</div>
        </div>
      </div>

      <PulseTicker
        items={[
          { label: 'Twitter followers', value: tw.followers.toLocaleString(), trend: 'up' },
          { label: 'Instagram followers', value: ig.followers.toLocaleString(), trend: 'up' },
          { label: 'Total posts', value: overview.totals.posts, trend: 'up' },
          { label: 'Scheduler', value: 'Active — checking every 60s', trend: 'up' },
        ]}
      />

      <div className="metric-grid">
        <MetricCard platform="total" label="Combined followers" value={overview.totals.followers} delta={3.2} />
        <MetricCard platform="twitter" label="Twitter followers" value={tw.followers} delta={2.1} />
        <MetricCard platform="instagram" label="Instagram followers" value={ig.followers} delta={4.6} />
        <MetricCard platform="total" label="Posts published" value={overview.totals.posts} delta={1.4} />
      </div>

      <div className="chart-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Follower growth — Twitter</h3>
            <span className="sub">Last 30 days</span>
          </div>
          <GrowthChart data={trend} dataKey="followers" color="#4FA8E0" />
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>Engagement by platform</h3>
            <span className="sub">Last 7 days</span>
          </div>
          <EngagementChart data={engagement} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Upcoming scheduled posts</h3>
          <span className="sub">{upcoming.length} queued</span>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty-state">
            <div className="title">Nothing scheduled yet</div>
            Head to the Schedule page to queue your next post.
          </div>
        ) : (
          upcoming.map((post) => (
            <div className="post-list-item" key={post.id}>
              <div>
                <div className="post-content-text">{post.content}</div>
                <div className="post-meta">
                  {post.platform.toUpperCase()} · {new Date(post.scheduled_for).toLocaleString()}
                </div>
              </div>
              <span className={`status-pill ${post.status}`}>{post.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
