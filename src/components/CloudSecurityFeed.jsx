import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import initialFeed from '../../priv/data/cloud-security-feed.json';

const date = (value, time = false) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  ...(time ? { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' } : {})
}).format(new Date(value));

export function filterFeedItems(items, { query = '', source = 'all', topic = 'all' } = {}) {
  const needle = query.trim().toLowerCase();
  return items.filter(item =>
    (source === 'all' || item.source_id === source) &&
    (topic === 'all' || item.topic === topic) &&
    `${item.title} ${item.source_name} ${item.topic}`.toLowerCase().includes(needle)
  );
}

function validSnapshot(value) {
  const https = url => { try { return new URL(url).protocol === 'https:'; } catch { return false; } };
  return value?.version === 1 && Array.isArray(value.items) && Array.isArray(value.sources) &&
    (value.updated_at === null || Number.isFinite(Date.parse(value.updated_at))) &&
    value.items.every(item => typeof item.title === 'string' && https(item.url) &&
      typeof item.source_name === 'string' && typeof item.topic === 'string' && Number.isFinite(Date.parse(item.published_at))) &&
    value.sources.every(source => typeof source.name === 'string' && https(source.feed_url));
}

export function CloudFeedView({ snapshot = initialFeed, compact = false, query = '', source = 'all', topic = 'all', limit = 15, refreshing = false, error = '', onQuery, onSource, onTopic, onMore, onRefresh }) {
  const id = useId();
  const filtered = filterFeedItems(snapshot.items, { query, source, topic });
  const visible = filtered.slice(0, compact ? 3 : limit);
  const topics = [...new Set(snapshot.items.map(item => item.topic))].sort();
  const unavailable = snapshot.sources.filter(item => item.status !== 'ok');
  const publishers = [...snapshot.sources].sort((a, b) => a.name.localeCompare(b.name));
  const sourceCounts = snapshot.items.reduce((counts, item) => ({ ...counts, [item.source_id]: (counts[item.source_id] || 0) + 1 }), {});
  const stale = snapshot.updated_at && Date.now() - Date.parse(snapshot.updated_at) > 36 * 60 * 60 * 1000;

  if (compact) {
    return <div className="cloud-feed-preview">
      <div className="cloud-feed-preview-heading"><h3>Daily cloud security feed</h3><Link to="/blog#cloud-feed">All headlines →</Link></div>
      {snapshot.updated_at && <p className="cloud-feed-meta">Latest import <time dateTime={snapshot.updated_at}>{date(snapshot.updated_at, true)}</time></p>}
      <ul className="cloud-feed-preview-list">{visible.map(item => <li key={item.id}><a href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.source_name}</span>{item.title}<span aria-hidden="true">↗</span></a></li>)}</ul>
      {visible.length === 0 && <p className="cloud-feed-meta">No recent headlines are available. Browse the field guides below.</p>}
    </div>;
  }

  return <section id="cloud-feed" className="cloud-feed" aria-labelledby={`${id}-title`}>
    <div className="cloud-feed-heading">
      <div><p className="dev-eyebrow">Field Notes / Cloud security research</p><h2 id={`${id}-title`}>Daily Cloud Security Feed</h2><p>Cloud security headlines from the original publishers. Open an article to read it at the source.</p></div>
      <div className="cloud-feed-actions"><a href="/feeds/cloud-security.xml">Subscribe via RSS</a><a href="/feeds/cloud-security.opml" download>Download OPML</a><button type="button" onClick={onRefresh} disabled={refreshing}>{refreshing ? 'Checking…' : 'Check for updates'}</button></div>
    </div>
    <p className="cloud-feed-meta">{publishers.length} publishers · Updated daily · {snapshot.updated_at ? <>Latest successful import <time dateTime={snapshot.updated_at}>{date(snapshot.updated_at, true)}</time></> : 'Waiting for the first successful import.'}</p>
    {stale && <p className="cloud-feed-status" role="status">The last successful import is over 36 hours old. These are the most recent available headlines.</p>}
    {unavailable.length > 0 && <p className="cloud-feed-status" role="status">{unavailable.length} {unavailable.length === 1 ? 'source is' : 'sources are'} temporarily unavailable. Previously imported headlines are retained when available.</p>}
    {error && <p className="cloud-feed-status" role="status">{error}</p>}
    <div className="cloud-feed-controls" role="search" aria-label="Search cloud security headlines">
      <label htmlFor={`${id}-query`}>Search headlines<input id={`${id}-query`} type="search" value={query} onChange={event => onQuery?.(event.target.value)} placeholder="AWS, identity, Kubernetes…" /></label>
      <label htmlFor={`${id}-source`}>Publisher<select id={`${id}-source`} value={source} onChange={event => onSource?.(event.target.value)}><option value="all">All publishers</option>{publishers.map(item => <option key={item.id} value={item.id}>{item.name} ({sourceCounts[item.id] || 0})</option>)}</select></label>
      <label htmlFor={`${id}-topic`}>Topic<select id={`${id}-topic`} value={topic} onChange={event => onTopic?.(event.target.value)}><option value="all">All cloud security topics</option>{topics.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    </div>
    <p className="cloud-feed-meta" role="status">{filtered.length} {filtered.length === 1 ? 'headline' : 'headlines'} · Newest first</p>
    <ol className="cloud-feed-list">{visible.map(item => <li key={item.id} className="cloud-feed-item"><div className="cloud-feed-item-meta"><span>{item.source_name}</span><span>{item.topic}</span><time dateTime={item.published_at}>{date(item.published_at)}</time></div><h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}<span aria-hidden="true"> ↗</span></a></h3></li>)}</ol>
    {visible.length === 0 && <p className="cloud-feed-empty">{snapshot.items.length === 0 ? 'No recent cloud security headlines have been imported yet.' : 'No headlines match these filters. Try another search or publisher.'}</p>}
    {filtered.length > visible.length && <button className="cloud-feed-more" type="button" onClick={onMore}>Show more headlines</button>}
    <details className="cloud-feed-sources"><summary>Feed addresses and source status</summary><p>Broad security feeds are filtered for cloud topics. Source publication dates are preserved; imported headlines are not CloudSecCorner-authored articles.</p><ul>{publishers.map(item => <li key={item.id}><a href={item.feed_url} target="_blank" rel="noopener noreferrer">{item.name} RSS ↗</a><span>{sourceCounts[item.id] || 0} recent headlines · {item.status === 'ok' ? 'Import successful' : item.status === 'cached' ? 'Showing cached headlines' : 'Currently unavailable'}{item.last_success_at && <> · Last success <time dateTime={item.last_success_at}>{date(item.last_success_at, true)}</time></>}</span></li>)}</ul></details>
  </section>;
}

export default function CloudSecurityFeed({ compact = false }) {
  const [snapshot, setSnapshot] = useState(initialFeed);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [topic, setTopic] = useState('all');
  const [limit, setLimit] = useState(15);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const current = useRef(null);
  const active = useRef(false);

  const refresh = useCallback(async () => {
    current.current?.abort();
    const controller = new AbortController();
    current.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);
    setRefreshing(true);
    try {
      const response = await fetch('/data/cloud-security-feed.json', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Feed unavailable');
      const data = await response.json();
      if (!validSnapshot(data)) throw new Error('Invalid feed');
      if (active.current && !controller.signal.aborted) { setSnapshot(data); setError(''); }
    } catch {
      if (active.current && (!controller.signal.aborted || timedOut)) setError('Could not refresh. Showing the last available published feed.');
    } finally {
      clearTimeout(timeout);
      if (active.current && current.current === controller) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    active.current = true;
    refresh();
    const check = () => { if (document.visibilityState === 'visible') refresh(); };
    const interval = setInterval(check, 15 * 60 * 1000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => { active.current = false; current.current?.abort(); clearInterval(interval); window.removeEventListener('focus', check); document.removeEventListener('visibilitychange', check); };
  }, [refresh]);

  const change = setter => value => { setter(value); setLimit(15); };
  return <CloudFeedView snapshot={snapshot} compact={compact} query={query} source={source} topic={topic} limit={limit} refreshing={refreshing} error={error} onQuery={change(setQuery)} onSource={change(setSource)} onTopic={change(setTopic)} onMore={() => setLimit(previous => previous + 15)} onRefresh={refresh} />;
}
