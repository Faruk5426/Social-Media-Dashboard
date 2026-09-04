-- Social Media Dashboard - PostgreSQL Schema

DROP TABLE IF EXISTS post_metrics CASCADE;
DROP TABLE IF EXISTS scheduled_posts CASCADE;
DROP TABLE IF EXISTS platform_accounts CASCADE;
DROP TABLE IF EXISTS metrics_snapshot CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Linked social platform accounts (Twitter, Instagram, etc.)
CREATE TABLE platform_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('twitter', 'instagram')),
    handle VARCHAR(120) NOT NULL,
    access_token TEXT,
    connected_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, platform, handle)
);

-- Historical metric snapshots pulled from each platform (for charts/trends)
CREATE TABLE metrics_snapshot (
    id SERIAL PRIMARY KEY,
    platform_account_id INTEGER REFERENCES platform_accounts(id) ON DELETE CASCADE,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement_rate NUMERIC(6,3) DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Posts scheduled/published through the dashboard
CREATE TABLE scheduled_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('twitter', 'instagram')),
    content TEXT NOT NULL,
    media_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    scheduled_for TIMESTAMP NOT NULL,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Per-post performance metrics once published
CREATE TABLE post_metrics (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES scheduled_posts(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metrics_snapshot_account ON metrics_snapshot(platform_account_id);
CREATE INDEX idx_scheduled_posts_user ON scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status, scheduled_for);
