import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AwsDefenderPath({ labs = [] }) {
  const steps = labs.filter(lab => lab.track === 'AWS Defender').sort((a, b) => a.track_order - b.track_order);
  useEffect(() => {
    if (steps.length && window.location.hash === '#aws-defender-path') {
      document.getElementById('aws-defender-path')?.scrollIntoView();
    }
  }, [steps.length]);
  if (!steps.length) return null;
  return <section id="aws-defender-path" className="aws-defender-path kube-library-container my-10" aria-labelledby="aws-defender-title">
    <div className="aws-defender-heading">
      <div><p className="dev-eyebrow">A practical starting path</p><h2 id="aws-defender-title">AWS Defender Practice Path</h2></div>
      <p>Start with local evidence and regression tests. Extend to authorized AWS exports and a reviewed Terraform plan when ready.</p>
    </div>
    <ol className="aws-defender-steps">{steps.map(lab => <li key={lab.id}>
      <span className="aws-defender-step">Step {lab.track_order} · {lab.duration}</span>
      <h3><Link to={`/labs/${lab.id}`}>{lab.title}</Link></h3>
      <p>{lab.description}</p>
      <div><Link to={`/labs/${lab.id}`}>Open lab →</Link><Link to={lab.guide}>Read field note →</Link></div>
    </li>)}</ol>
    <p className="aws-defender-note">The local exercises require Python 3.10+. They include their own sample evidence and do not create cloud resources.</p>
  </section>;
}
