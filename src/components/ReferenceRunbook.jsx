import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function ReferenceRunbook({ reference, details }) {
  if (!reference && !details) return null;
  const content = reference || details;
  return (
    <details className="reference-runbook">
      <summary>{reference ? 'Runbook & Sources' : 'Control Scope & Verification'}</summary>
      <div>
        <p>{content.prerequisites || content.scope}</p>
        {reference && <div className="reference-links">
          <a href={reference.asset} download><Download size={14} />Configuration</a>
          <a href={reference.policy} download><Download size={14} />OPA policy</a>
        </div>}
        {content.commands && <pre tabIndex={0} aria-label="Run commands"><code>{content.commands}</code></pre>}
        {content.expected && <p>{content.expected}</p>}
        {content.checks && <ul>{content.checks.map(check => <li key={check}>{check}</li>)}</ul>}
        <ul>
          {content.sources.map((source, index) => <li key={source}><a href={source} target="_blank" rel="noreferrer"><ExternalLink size={14} />{new URL(source).hostname} · Reference {index + 1}</a></li>)}
        </ul>
      </div>
    </details>
  );
}
