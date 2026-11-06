import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from './PageHeader';
import OpenGraph from './OpenGraph';
import catalog from '../data/home-catalog.json';
import { REPOSITORY_URL } from '../utils/socialSharing';

export default function AboutPage() {
  return <main className="dev-page">
    <OpenGraph title="About Cloud Security Corner" description="An open engineering library for cloud application patterns, security tools and practical labs." />
    <PageHeader title="About Cloud Security Corner" description="An open engineering library for developers building and securing cloud applications." stats={[{ label: 'Implementation Profiles', value: catalog.counts.profiles }, { label: 'Hands-On Labs', value: catalog.counts.labs }, { label: 'Tool Entries', value: catalog.counts.tools }]} />
    <div className="dev-container dev-about-copy">
      <h2>Engineering in the Open</h2>
      <p>CloudSecCorner brings together application integration patterns, configuration references, security tools, and hands-on labs for AWS, Azure, Google Cloud, Kubernetes, and agentic systems.</p>
      <p>The library focuses on service dependencies, identity boundaries, deployment checks, and operational verification. Architecture examples include implementation notes and debugging guidance alongside the relevant controls.</p>
      <h2>Explore the Library</h2>
      <p><Link to="/aws-architectures">Developer architectures</Link>, <Link to="/labs">hands-on labs</Link>, <Link to="/tools">the security tool directory</Link>, and <Link to="/blog">field notes</Link> cover complementary parts of building and reviewing cloud applications.</p>
      <h2>Contribute</h2>
      <p>Improve a diagram, report an outdated link, clarify a lab, or recommend a project through the <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">contribution guide</a>. Source and issues are available in the <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">GitHub repository</a>.</p>
    </div>
  </main>;
}
