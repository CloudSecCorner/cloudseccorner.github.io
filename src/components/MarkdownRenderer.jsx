import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { render as renderPele } from 'pele';

// Safe Pele Vector Diagram Component
const PeleDiagram = ({ code, language }) => {
  const renderedSvg = useMemo(() => {
    try {
      if (!code || typeof code !== 'string') return null;
      const cleanCode = code.trim();
      const result = renderPele(cleanCode);
      return result?.svg || null;
    } catch (err) {
      console.warn('Pele diagram render error:', err);
      return null;
    }
  }, [code]);

  if (!renderedSvg) {
    return (
      <div className="relative my-7 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs">
        <div className="text-[10px] uppercase font-bold text-amber-400 mb-2">Diagram Source</div>
        <pre className="overflow-x-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div className="my-8 w-full rounded-2xl border border-slate-200/90 dark:border-[#2e2747] bg-white dark:bg-[#130f1c] shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-[#1a1528] border-b border-slate-200 dark:border-[#26203b] text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold">
            Pele Architecture Vector Topology
          </span>
        </div>
        <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
          Interactive SVG
        </span>
      </div>
      <div className="blueprint-canvas p-6 sm:p-8 flex justify-center items-center overflow-x-auto min-h-[220px] w-full">
        <div
          className="pele-svg-container w-full max-w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      </div>
    </div>
  );
};

// Helper: Extract plain text from React children
function getChildrenText(children) {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(getChildrenText).join('');
  }
  if (React.isValidElement(children) && children.props) {
    return getChildrenText(children.props.children);
  }
  return '';
}

// Helper: Generate URL-safe slug from heading text
function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Enhanced Code Block with Language Badge & Copy Button
const CodeBlock = ({ language, codeElement, rawCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!rawCode) return;
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-[#2e2747] bg-slate-950 dark:bg-[#0c0915] shadow-md group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 dark:bg-[#161224] border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          {/* macOS window dots */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          {language && (
            <span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium font-mono text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 transition border border-slate-700/60 cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-slate-200 font-mono">
        {codeElement}
      </pre>
    </div>
  );
};

// Anchor-enabled Heading Component
const Heading = ({ level, children, ...props }) => {
  const text = getChildrenText(children);
  const slug = slugify(text);
  const Tag = `h${level}`;

  const styles = {
    1: 'scroll-mt-24 text-slate-900 dark:text-white font-extrabold text-2xl sm:text-3xl mt-10 mb-5 border-b border-slate-200 dark:border-slate-800 pb-3',
    2: 'scroll-mt-24 text-slate-900 dark:text-white font-bold text-xl sm:text-2xl mt-10 mb-4 border-b border-slate-200/70 dark:border-slate-800/60 pb-2.5',
    3: 'scroll-mt-24 text-slate-900 dark:text-slate-100 font-bold text-lg sm:text-xl mt-8 mb-3',
    4: 'scroll-mt-24 text-slate-800 dark:text-slate-200 font-semibold text-base sm:text-lg mt-6 mb-2',
    5: 'scroll-mt-24 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base mt-4 mb-2',
    6: 'scroll-mt-24 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm mt-3 mb-1 uppercase tracking-wider',
  };

  return (
    <Tag id={slug} className={`group flex items-center justify-between ${styles[level] || styles[2]}`} {...props}>
      <span>{children}</span>
      {slug && (
        <a
          href={`#${slug}`}
          className="opacity-0 group-hover:opacity-100 ml-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-opacity text-sm font-normal"
          aria-label={`Link to ${text}`}
        >
          #
        </a>
      )}
    </Tag>
  );
};

// Callout / Blockquote with GitHub-Style Alerts
const Blockquote = ({ children, ...props }) => {
  const text = getChildrenText(children);
  const alertMatch = text.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);

  if (alertMatch) {
    const type = alertMatch[1].toUpperCase();
    const config = {
      NOTE: {
        border: 'border-blue-500',
        bg: 'bg-blue-50/80 dark:bg-blue-950/25',
        text: 'text-blue-950 dark:text-blue-200',
        badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
        title: 'NOTE',
      },
      TIP: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-50/80 dark:bg-emerald-950/25',
        text: 'text-emerald-950 dark:text-emerald-200',
        badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
        title: 'PRO TIP',
      },
      IMPORTANT: {
        border: 'border-purple-500',
        bg: 'bg-purple-50/80 dark:bg-purple-950/25',
        text: 'text-purple-950 dark:text-purple-200',
        badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
        title: 'IMPORTANT',
      },
      WARNING: {
        border: 'border-amber-500',
        bg: 'bg-amber-50/80 dark:bg-amber-950/25',
        text: 'text-amber-950 dark:text-amber-200',
        badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
        title: 'WARNING',
      },
      CAUTION: {
        border: 'border-rose-500',
        bg: 'bg-rose-50/80 dark:bg-rose-950/25',
        text: 'text-rose-950 dark:text-rose-200',
        badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
        title: 'SECURITY CAUTION',
      },
    }[type] || {
      border: 'border-purple-500',
      bg: 'bg-purple-50/80 dark:bg-purple-950/25',
      text: 'text-purple-950 dark:text-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      title: type,
    };

    return (
      <div className={`my-6 rounded-xl border-l-4 ${config.border} ${config.bg} p-4 sm:p-5 shadow-xs`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${config.badge}`}>
            {config.title}
          </span>
        </div>
        <div className={`text-sm sm:text-base leading-relaxed ${config.text} [&>p:first-child]:mt-0 [&>p:last-child]:mb-0`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <blockquote className="rounded-r-xl border-l-4 border-purple-500 bg-purple-50/60 dark:bg-[#1f1930] py-3.5 px-5 my-6 text-slate-700 dark:text-slate-300 italic shadow-xs" {...props}>
      {children}
    </blockquote>
  );
};

const MarkdownRenderer = ({ children, content, className = '' }) => {
  const markdownText = children || content || '';

  return (
    <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${className}`}>
      <ReactMarkdown
        skipHtml
        components={{
          pre: ({ children: codeElement }) => {
            const isCode = React.isValidElement(codeElement);
            const codeClassName = isCode ? codeElement.props.className || '' : '';
            const match = /language-(\w+)/.exec(codeClassName);
            const language = match ? match[1] : '';

            let rawCode = '';
            if (isCode) {
              const c = codeElement.props.children;
              rawCode = Array.isArray(c) ? c.join('') : (typeof c === 'string' ? c : '');
            }

            if (rawCode) {
              const trimmed = rawCode.trim();
              const isDiagram =
                language === 'mermaid' ||
                language === 'pele' ||
                language === 'architecture' ||
                trimmed.startsWith('flowchart') ||
                trimmed.startsWith('graph') ||
                trimmed.startsWith('sequenceDiagram') ||
                trimmed.startsWith('stateDiagram') ||
                trimmed.startsWith('erDiagram') ||
                trimmed.startsWith('architecture');

              if (isDiagram) {
                return <PeleDiagram code={trimmed} language={language} />;
              }
            }

            return (
              <CodeBlock
                language={language}
                codeElement={codeElement}
                rawCode={rawCode}
              />
            );
          },
          code: ({ children: code, className: codeClassName, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code
                  className="rounded bg-slate-100 dark:bg-[#1f1b2e] px-1.5 py-0.5 text-xs sm:text-sm font-mono text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-[#2e2747]"
                  {...props}
                >
                  {code}
                </code>
              );
            }
            return (
              <code className={codeClassName} {...props}>
                {code}
              </code>
            );
          },
          h1: (props) => <Heading level={1} {...props} />,
          h2: (props) => <Heading level={2} {...props} />,
          h3: (props) => <Heading level={3} {...props} />,
          h4: (props) => <Heading level={4} {...props} />,
          h5: (props) => <Heading level={5} {...props} />,
          h6: (props) => <Heading level={6} {...props} />,
          p: ({ children: paragraph, ...props }) => (
            <p className="leading-relaxed my-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base" {...props}>
              {paragraph}
            </p>
          ),
          a: ({ href = '', children: label, ...props }) => {
            const external = /^https?:\/\//i.test(href);
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                {...props}
              >
                {label}
              </a>
            );
          },
          blockquote: (props) => <Blockquote {...props} />,
          table: ({ children: rows, ...props }) => (
            <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left" {...props}>
                {rows}
              </table>
            </div>
          ),
          thead: ({ children: rows, ...props }) => (
            <thead className="bg-slate-100 dark:bg-[#1a1528] text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider" {...props}>
              {rows}
            </thead>
          ),
          tbody: ({ children: rows, ...props }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#130f1c]" {...props}>
              {rows}
            </tbody>
          ),
          th: ({ children: value, ...props }) => (
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200" {...props}>
              {value}
            </th>
          ),
          td: ({ children: value, ...props }) => (
            <td className="px-4 py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300" {...props}>
              {value}
            </td>
          ),
          ul: ({ children: items, ...props }) => (
            <ul className="my-4 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base" {...props}>
              {items}
            </ul>
          ),
          ol: ({ children: items, ...props }) => (
            <ol className="my-4 list-decimal space-y-2 pl-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base" {...props}>
              {items}
            </ol>
          ),
          li: ({ children: item, ...props }) => (
            <li className="pl-1 leading-relaxed" {...props}>{item}</li>
          ),
          hr: (props) => <hr className="my-8 border-slate-200 dark:border-slate-800" {...props} />,
          img: ({ src, alt = '', ...props }) => (
            <span className="my-6 block">
              <img
                src={src}
                alt={alt}
                className="mx-auto max-w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                loading="lazy"
                {...props}
              />
              {alt && <span className="mt-2 block text-center text-xs text-slate-500 dark:text-slate-400">{alt}</span>}
            </span>
          ),
          strong: ({ children: value, ...props }) => (
            <strong className="font-bold text-slate-900 dark:text-white" {...props}>{value}</strong>
          ),
          em: ({ children: value, ...props }) => (
            <em className="italic text-purple-700 dark:text-purple-300" {...props}>{value}</em>
          ),
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
