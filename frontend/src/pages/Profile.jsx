import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { updateMe, fetchAccounts } from '../services/api.js';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts().then((res) => setAccounts(res.data.accounts));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMe({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <div className="sub">Manage your account and connected platforms.</div>
        </div>
      </div>

      <div className="composer-grid">
        <div className="panel">
          <div className="panel-header"><h3>Account details</h3></div>
          <form onSubmit={handleSave}>
            <div className="field-group">
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            </div>
            <button className="btn-primary" type="submit">{saved ? 'Saved ✓' : 'Save changes'}</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header"><h3>Connected platforms</h3></div>
          {accounts.length === 0 ? (
            <div className="empty-state">No platforms connected yet.</div>
          ) : (
            accounts.map((acc) => (
              <div className="post-list-item" key={acc.id}>
                <div>
                  <div className="post-content-text" style={{ textTransform: 'capitalize' }}>{acc.platform}</div>
                  <div className="post-meta">@{acc.handle}</div>
                </div>
                <span className="status-pill published">Connected</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
