import React, { useEffect, useState } from 'react';
import { fetchTrend, fetchEngagement, fetchOverview } from '../services/api.js';
import GrowthChart from '../components/GrowthChart.jsx';
import EngagementChart from '../components/EngagementChart.jsx';
import MetricCard from '../components/MetricCard.jsx';

const RANGE_OPTIONS = [7, 14, 30, 90];

export default function Analytics() {
  const [platform, setPlatform] = useState('twitter');
  const [days, setDays] = useState(30);
  const [trend, setTrend] = useState([]);
  const [engagement, setEngagement] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchTrend(platform, days), fetchEngagement(), fetchOverview()])
      .then(([tr, eng, ov]) => {
        if (!mounted) return;
        setTrend(tr.data.trend);
        setEngagement(eng.data.breakdown);
        setOverview(ov.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [platform, days]);

  const color = platform === 'twitter' ? '#4FA8E0' : '#E1306C';

  const totals = trend.reduce(
    (acc, d) => ({
      likes: acc.likes + d.likes,
      comments: acc.comments + d.comments,
      impressions: acc.impressions + d.impressions,
    }),
    { likes: 0, comments: 0, impressions: 0 }
  );
  const avgEngagementRate = trend.length
    ? (trend.reduce((s, d) => s + d.engagementRate, 0) / trend.length).toFixed(2)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <div className="sub">Deep-dive into performance across your connected accounts.</div>
        </div>
        <div className="platform-picker" style={{ maxWidth: 280 }}>
          <button
            className={`platform-chip twitter${platform === 'twitter' ? ' active' : ''}`}
            onClick={() => setPlatform('twitter')}
          >
            Twitter
          </button>
          <button
            className={`platform-chip instagram${platform === 'instagram' ? ' active' : ''}`}
            onClick={() => setPlatform('instagram')}
          >
            Instagram
          </button>
        </div>
      </div>

      <div className="tab-row">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r}
            className={`tab-btn${days === r ? ' active' : ''}`}
            onClick={() => setDays(r)}
          >
            {r}d
          </button>
        ))}
      </div>

      {!loading && overview && (
        <div className="metric-grid">
          <MetricCard platform={platform} label="Total likes" value={totals.likes} formatValue={(v) => v.toLocaleString()} />
          <MetricCard platform={platform} label="Total comments" value={totals.comments} formatValue={(v) => v.toLocaleString()} />
          <MetricCard platform={platform} label="Total impressions" value={totals.impressions} formatValue={(v) => v.toLocaleString()} />
          <MetricCard platform={platform} label="Avg. engagement rate" value={avgEngagementRate} formatValue={(v) => `${v}%`} />
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h3>Follower growth</h3>
          <span className="sub">{platform === 'twitter' ? 'Twitter' : 'Instagram'} · last {days} days</span>
        </div>
        {loading ? <div className="loading-shimmer" /> : <GrowthChart data={trend} dataKey="followers" color={color} />}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Impressions trend</h3>
          <span className="sub">Reach across posts</span>
        </div>
        {loading ? <div className="loading-shimmer" /> : <GrowthChart data={trend} dataKey="impressions" color="#3FD08C" />}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Engagement breakdown</h3>
          <span className="sub">Likes, comments &amp; shares — last 7 days</span>
        </div>
        {loading ? <div className="loading-shimmer" /> : <EngagementChart data={engagement} />}
      </div>
    </div>
  );
}
