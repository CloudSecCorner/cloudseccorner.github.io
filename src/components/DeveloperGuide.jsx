import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function DeveloperGuide({ guide }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setCopied(false); setError(''); }, [guide]);

  const copyDiagnostics = async () => {
    try {
      await navigator.clipboard.writeText(guide.diagnostics);
      setCopied(true);
      setError('');
    } catch {
      setError('Clipboard access is unavailable.');
    }
  };

  return (
    <div className="developer-guide">
      <h4>{guide.name}</h4>
      <dl><dt>Integration Contract</dt><dd>{guide.contract}</dd></dl>
      <h4>Dependencies</h4>
      <ul>{guide.dependencies.map(item => <li key={item}>{item}</li>)}</ul>
      <h4>Implementation</h4>
      <ol>{guide.steps.map(item => <li key={item}>{item}</li>)}</ol>
      <h4>Integration Tests</h4>
      <ul>{guide.tests.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="developer-command-heading">
        <h4>Read-Only Diagnostics</h4>
        <button type="button" onClick={copyDiagnostics} title={copied ? 'Commands copied' : 'Copy commands'} aria-label={copied ? 'Commands copied' : 'Copy commands'}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
      </div>
      <pre tabIndex={0}><code>{guide.diagnostics}</code></pre>
      {error && <p role="status">{error}</p>}
      <h4>Debugging</h4>
      <ul>{guide.failures.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="developer-scope">{guide.scope}</p>
    </div>
  );
}
