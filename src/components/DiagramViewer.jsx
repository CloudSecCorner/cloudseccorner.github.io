import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Code2, Download, FileCode, Maximize, Minimize, Network, RotateCcw, Workflow, ZoomIn, ZoomOut } from 'lucide-react';
import './DiagramViewer.css';
import ReferenceRunbook from './ReferenceRunbook';
import DeveloperGuide from './DeveloperGuide';

export default function DiagramViewer({ svg, title = 'Architecture diagram', filename = 'architecture', reference, details, architecture, source, fitToViewport = false }) {
  const root = useRef(null);
  const tabId = useId();
  const [mode, setMode] = useState('runtime');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  const guide = architecture?.developer_guide;
  const activeSvg = mode === 'deployment' ? architecture?.deployment_svg : svg;
  const activeSource = mode === 'deployment' ? architecture?.deployment_mermaid : (source || architecture?.mermaid);
  const markup = useMemo(() => ({ __html: activeSvg }), [activeSvg]);

  useEffect(() => {
    setZoom(100);
    setError('');
    setMode('runtime');
  }, [svg]);

  useEffect(() => { setZoom(100); }, [mode]);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const download = () => {
    const rendered = root.current.querySelector('.diagram-content > svg');
    if (!rendered) return;
    const clone = rendered.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // Keep theme-dependent colors when the exported SVG is opened on its own.
    const originals = [rendered, ...rendered.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];
    originals.forEach((element, index) => {
      const style = getComputedStyle(element);
      ['fill', 'stroke', 'color', 'font-family', 'font-size', 'font-weight'].forEach(property => {
        copies[index].style.setProperty(property, style.getPropertyValue(property));
      });
    });
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-z0-9_-]/gi, '-')}-${mode}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadSource = () => {
    const url = URL.createObjectURL(new Blob([activeSource], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-z0-9_-]/gi, '-')}-${mode}.mmd`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const modes = [
    { id: 'runtime', label: 'Integration', icon: Network },
    { id: 'deployment', label: 'Deploy', icon: Workflow },
    { id: 'build', label: 'Build Notes', icon: Code2 }
  ];

  const onTabKeyDown = event => {
    const index = modes.findIndex(item => item.id === mode);
    const next = event.key === 'ArrowRight' ? (index + 1) % modes.length
      : event.key === 'ArrowLeft' ? (index + modes.length - 1) % modes.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? modes.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setMode(modes[next].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };

  const toggleFullscreen = async () => {
    try {
      if (fullscreen) await document.exitFullscreen();
      else await root.current.requestFullscreen();
      setError('');
    } catch {
      setError('Fullscreen is unavailable in this browser.');
    }
  };

  return (
    <section ref={root} className="diagram-viewer" aria-label={title}>
      <div className="diagram-toolbar" role="group" aria-label="Diagram controls">
        <span className="diagram-title" title={title}>{title}</span>
        {mode !== 'build' && <div className="diagram-actions">
          <button type="button" title="Zoom out" aria-label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}><ZoomOut size={16} /></button>
          <output aria-label="Zoom level">{zoom}%</output>
          <button type="button" title="Zoom in" aria-label="Zoom in" disabled={zoom >= 300} onClick={() => setZoom(value => Math.min(300, value + 25))}><ZoomIn size={16} /></button>
          <button type="button" title="Reset zoom" aria-label="Reset zoom" onClick={() => setZoom(100)}><RotateCcw size={16} /></button>
          <button type="button" title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>{fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
          <button type="button" title="Download SVG" aria-label="Download SVG" onClick={download}><Download size={16} /></button>
          {activeSource && <button type="button" title="Download Mermaid source" aria-label="Download Mermaid source" onClick={downloadSource}><FileCode size={16} /></button>}
        </div>}
      </div>
      {guide && <div className="diagram-tabs" role="tablist" aria-label="Architecture view">
        {modes.map(item => <button key={item.id} type="button" role="tab" id={`${tabId}-${item.id}`} aria-controls={`${tabId}-panel`} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => setMode(item.id)} onKeyDown={onTabKeyDown}><item.icon size={15} />{item.label}</button>)}
      </div>}
      {error && <p className="diagram-error" role="status">{error}</p>}
      <div id={`${tabId}-panel`} role={guide ? 'tabpanel' : undefined} aria-labelledby={guide ? `${tabId}-${mode}` : undefined}>
        {mode === 'build' && guide ? <DeveloperGuide guide={guide} /> : <div className={`diagram-viewport${fitToViewport ? ' diagram-fit' : ''}`} tabIndex={0} role="region" aria-label={`${title}, scrollable diagram`}>
          <div className="diagram-content" style={{ width: `${zoom}%`, height: fitToViewport ? `${zoom}%` : undefined }} role="img" aria-label={title} dangerouslySetInnerHTML={markup} />
        </div>}
      </div>
      <ReferenceRunbook reference={reference} details={details} />
    </section>
  );
}
