import React from 'react';

export default function PageHeader({ title, description, eyebrow = 'CloudSecCorner / Engineering', stats = [], actions, children }) {
  return (
    <header className="dev-page-header">
      <div className="dev-container">
        <div className="dev-header-row"><div><p className="dev-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="dev-header-description">{description}</p>}</div>{actions && <div className="dev-header-actions">{actions}</div>}</div>
        {stats.length > 0 && <dl className="dev-header-stats">{stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{typeof stat.value === 'number' ? stat.value.toLocaleString('en-US') : stat.value}</dd></div>)}</dl>}
        {children}
      </div>
    </header>
  );
}
