import React, { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, FileCode, Github, Search, Terminal, Wrench } from 'lucide-react';
import DiagramViewer from './DiagramViewer';
import catalog from '../data/home-catalog.json';
import referenceArchitectures from '../data/reference-architectures.json';
import { selectedHomeProvider, toolsSearchPath } from '../lib/home-navigation';
import { REPOSITORY_URL, getAbsoluteUrl } from '../utils/socialSharing';
import './LandingPage.css';

const number = value => value.toLocaleString('en-US');
const queries = ['Kubernetes', 'OPA', 'MCP', 'SBOM', 'Zero Trust'];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const provider = selectedHomeProvider(catalog.providers, params.get('provider'));
  const example = referenceArchitectures[provider.id][0];
  const tabId = useId();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: 'Cloud Security Corner', url: getAbsoluteUrl(),
      description: 'Developer architecture patterns, cloud configuration examples, hands-on security labs, and a searchable tool directory.',
      sameAs: ['https://github.com/CloudSecCorner'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: getAbsoluteUrl('/tools?q={search_term_string}') },
        'query-input': 'required name=search_term_string'
      }
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const selectProvider = id => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set('provider', id);
    return next;
  }, { preventScrollReset: true });

  const onProviderKeyDown = event => {
    const index = catalog.providers.findIndex(item => item.id === provider.id);
    const length = catalog.providers.length;
    const next = event.key === 'ArrowRight' ? (index + 1) % length
      : event.key === 'ArrowLeft' ? (index + length - 1) % length
      : event.key === 'Home' ? 0 : event.key === 'End' ? length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    selectProvider(catalog.providers[next].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };

  return (
    <main id="main-content" tabIndex={-1} className="developer-home">
      <header className="home-intro home-inner">
        <div className="home-intro-top">
          <div>
            <p className="home-eyebrow">The CloudSecCorner engineering library</p>
            <h1>Cloud Security Corner</h1>
            <p className="home-deck">Application architectures, cloud integration patterns, and hands-on security engineering.</p>
          </div>
          <a className="home-repository" href={REPOSITORY_URL} target="_blank" rel="noreferrer" aria-label="Source on GitHub"><Github size={17} /><span>Source</span><ArrowUpRight size={14} /></a>
        </div>
        <dl className="home-counts">
          <div><dt>Implementation profiles</dt><dd>{number(catalog.counts.profiles)}</dd></div>
          <div><dt>Configuration examples</dt><dd>{number(catalog.counts.examples)}</dd></div>
          <div><dt>Hands-on labs</dt><dd>{number(catalog.counts.labs)}</dd></div>
          <div><dt>Tool directory entries</dt><dd>{number(catalog.counts.tools)}</dd></div>
        </dl>
      </header>

      <section className="home-provider-band" aria-labelledby="home-architectures">
        <div className="home-inner">
          <div className="home-section-heading"><h2 id="home-architectures">Developer Architectures</h2><span>APIs, storage, identity, and application delivery</span></div>
          <div className="home-provider-grid">
            {catalog.providers.map(item => <Link key={item.id} to={item.route} className="home-provider-link">
              <div className="home-provider-name"><img src={item.logo} alt="" width="36" height="32" /><h3>{item.name}</h3><ArrowUpRight size={16} aria-hidden="true" /></div>
              <p>{item.scope}</p>
              <div className="home-provider-meta"><span>{number(item.profileCount)} profiles</span><span>{item.serviceCount} resource families</span></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="home-example home-inner" aria-labelledby="home-example-title">
        <div className="home-section-heading"><div><p className="home-eyebrow">Configuration reference</p><h2 id="home-example-title">{example.title.replace(/^Reference:\s*/, '')}</h2></div><Link to={provider.route} className="home-text-link">Open {provider.name} catalog<ArrowRight size={16} /></Link></div>
        <div className="home-provider-tabs" role="tablist" aria-label="Reference example provider">
          {catalog.providers.map(item => <button key={item.id} id={`${tabId}-${item.id}`} type="button" role="tab" aria-selected={provider.id === item.id} aria-controls={`${tabId}-example`} tabIndex={provider.id === item.id ? 0 : -1} onClick={() => selectProvider(item.id)} onKeyDown={onProviderKeyDown}><img src={item.logo} alt="" width="24" height="24" />{item.name}</button>)}
        </div>
        <div id={`${tabId}-example`} role="tabpanel" aria-labelledby={`${tabId}-${provider.id}`}>
          <DiagramViewer key={example.id} svg={example.svg} title={example.title} filename={example.id} reference={example.reference} details={example.diagram_details} architecture={example} fitToViewport />
        </div>
        <div className="home-example-assets"><a href={example.reference.asset} download><FileCode size={15} />{provider.id === 'kspm' ? 'workload.yaml' : 'main.tf'}</a><a href={example.reference.policy} download><FileCode size={15} />policy.rego</a></div>
      </section>

      <section className="home-lab-band" aria-labelledby="home-labs-title">
        <div className="home-inner">
          <div className="home-section-heading"><h2 id="home-labs-title">Hands-On Labs</h2><Link to="/labs" className="home-text-link">All labs<ArrowRight size={16} /></Link></div>
          <div className="home-lab-grid">
            {catalog.labs.map(lab => <Link key={lab.id} to={lab.route} className="home-lab-link"><Terminal size={19} aria-hidden="true" /><div><span className="home-lab-category">{lab.category}</span><h3>{lab.title}</h3><p>{lab.description}</p></div><ArrowUpRight size={15} aria-hidden="true" /></Link>)}
          </div>
        </div>
      </section>

      <section className="home-tools home-inner" aria-labelledby="home-tools-title">
        <div className="home-section-heading"><div><p className="home-eyebrow">{number(catalog.counts.tools)} indexed entries</p><h2 id="home-tools-title">Security Tool Directory</h2></div><Link to="/tools" className="home-text-link"><Wrench size={16} />Browse directory<ArrowRight size={16} /></Link></div>
        <form onSubmit={event => { event.preventDefault(); navigate(toolsSearchPath(searchQuery)); }} role="search" aria-label="Search the security tool directory" className="home-tool-form">
          <label htmlFor="home-tool-search">Tool, project, or framework</label>
          <div className="home-search-row"><div className="home-search-field"><Search size={18} aria-hidden="true" /><input id="home-tool-search" name="q" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Kubernetes, MCP, OPA, SAST..." /></div><button type="submit"><Search size={16} />Search tools</button></div>
        </form>
        <div className="home-query-links">{queries.map(query => <Link key={query} to={toolsSearchPath(query)}>{query}<ArrowUpRight size={12} /></Link>)}</div>
      </section>

      <section className="home-notes-band" aria-labelledby="home-notes-title">
        <div className="home-inner">
          <div className="home-section-heading"><h2 id="home-notes-title">Field Notes</h2><Link to="/blog" className="home-text-link">All notes<ArrowRight size={16} /></Link></div>
          {catalog.blogs.map(post => <Link key={post.id} to={post.route} className="home-field-note"><BookOpen size={19} aria-hidden="true" /><div><span className="home-lab-category">{post.category}</span><h3>{post.title}</h3></div><ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          <div className="home-community"><p>Contribute a pattern, improve a lab, or report an issue.</p><a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">Contribution guide<ArrowUpRight size={14} /></a><a href={`${REPOSITORY_URL}/issues`} target="_blank" rel="noreferrer">Issues<ArrowUpRight size={14} /></a><a href="/llm.txt">Machine-readable index<ArrowUpRight size={14} /></a></div>
        </div>
      </section>
    </main>
  );
}
