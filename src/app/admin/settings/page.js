'use client';

import { useState, useEffect } from 'react';
import { Globe, Bell, Phone } from 'lucide-react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_title: '',
    phone_number: '',
    whatsapp_number: '',
    announcement: '',
    announcement_active: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save');

      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Site Settings</h1>
        <p className={styles.subtitle}>Configure your website settings</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Globe size={20} />
            General
          </h2>
          <div className="form-group">
            <label className="form-label">Site Title</label>
            <input
              type="text"
              className="form-input"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              placeholder="Namaz Blogs"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Phone size={20} />
            Contact
          </h2>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={settings.phone_number}
              onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp Number (with country code)</label>
            <input
              type="text"
              className="form-input"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="+911234567890"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Bell size={20} />
            Announcement Banner
          </h2>
          <div className="form-group">
            <label className="form-label">Announcement Text</label>
            <input
              type="text"
              className="form-input"
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder="Welcome to our website!"
            />
          </div>
          <div className={styles.toggle}>
            <div
              className={`${styles.toggleSwitch} ${settings.announcement_active ? styles.active : ''}`}
              onClick={() => setSettings({ ...settings, announcement_active: !settings.announcement_active })}
            />
            <span className={styles.toggleLabel}>Show announcement banner</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
