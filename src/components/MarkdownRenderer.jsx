import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { render as renderPele } from 'pele';
import DiagramViewer from './DiagramViewer';
import labDiagrams from '../data/lab-diagrams.json';

// Safe Pele Vector Diagram Component
const PeleDiagram = ({ code, language }) => {
  const renderedSvg = useMemo(() => {
  try {
    if (code && typeof code === 'string') {
      const cleanCode = code.trim();
      if (labDiagrams[cleanCode]) return labDiagrams[cleanCode];
      const result = renderPele(cleanCode);
      return result?.svg || null;
    }
  } catch (err) {
    console.warn('Pele diagram render error:', err);
  }
  return null;
  }, [code]);

  if (!renderedSvg) {
    return (
      <div className="relative my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs">
        <div className="text-[10px] uppercase font-bold text-amber-400 mb-2">Diagram Source</div>
        <pre className="overflow-x-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div className="my-8">
      <DiagramViewer svg={renderedSvg} title="Lab diagram" filename="lab-diagram" />
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
const CodeBlock = ({ language, rawCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!rawCode) return;
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-[#2e2747] bg-slate-950 dark:bg-[#0c0915] shadow-md group">
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
      <pre className="overflow-x-auto p-4 sm:p-5 text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-100 font-mono bg-transparent m-0 border-0">
        <code className="bg-transparent text-slate-100 p-0 border-0 font-mono leading-relaxed block">{rawCode}</code>
      </pre>
    </div>
  );
};

// Anchor-enabled Heading Component with Dynamic Sizing
const Heading = ({ level, fontSize = 'normal', children, ...props }) => {
  const text = getChildrenText(children);
  const slug = slugify(text);
  const Tag = `h${level}`;

  // Adaptive font scales based on reader setting
  const scaleMaps = {
    normal: {
      1: 'text-2xl sm:text-3xl lg:text-4xl mt-10 mb-5 pb-3',
      2: 'text-xl sm:text-2xl lg:text-3xl mt-10 mb-4 pb-2.5',
      3: 'text-lg sm:text-xl lg:text-2xl mt-8 mb-3',
      4: 'text-base sm:text-lg lg:text-xl mt-6 mb-2',
      5: 'text-sm sm:text-base lg:text-lg mt-4 mb-2',
      6: 'text-xs sm:text-sm lg:text-base mt-3 mb-1 uppercase tracking-wider',
    },
    large: {
      1: 'text-3xl sm:text-4xl lg:text-5xl mt-12 mb-6 pb-4',
      2: 'text-2xl sm:text-3xl lg:text-4xl mt-12 mb-5 pb-3',
      3: 'text-xl sm:text-2xl lg:text-3xl mt-10 mb-4',
      4: 'text-lg sm:text-xl lg:text-2xl mt-8 mb-3',
      5: 'text-base sm:text-lg lg:text-xl mt-5 mb-2',
      6: 'text-sm sm:text-base lg:text-lg mt-4 mb-2 uppercase tracking-wider',
    },
    xlarge: {
      1: 'text-4xl sm:text-5xl lg:text-6xl mt-14 mb-7 pb-4',
      2: 'text-3xl sm:text-4xl lg:text-5xl mt-14 mb-6 pb-3',
      3: 'text-2xl sm:text-3xl lg:text-4xl mt-11 mb-4',
      4: 'text-xl sm:text-2xl lg:text-3xl mt-9 mb-3',
      5: 'text-lg sm:text-xl lg:text-2xl mt-6 mb-2',
      6: 'text-base sm:text-lg lg:text-xl mt-4 mb-2 uppercase tracking-wider',
    },
  };

  const currentScale = scaleMaps[fontSize] || scaleMaps.normal;
  const sizeClasses = currentScale[level] || currentScale[2];

  const baseStyles = {
    1: 'scroll-mt-32 text-slate-900 dark:text-white font-extrabold border-b border-slate-200 dark:border-slate-800 tracking-tight',
    2: 'scroll-mt-32 text-slate-900 dark:text-white font-bold border-b border-slate-200/70 dark:border-slate-800/60 tracking-tight',
    3: 'scroll-mt-32 text-slate-900 dark:text-slate-100 font-bold tracking-tight',
    4: 'scroll-mt-32 text-slate-800 dark:text-slate-200 font-semibold',
    5: 'scroll-mt-32 text-slate-800 dark:text-slate-200 font-semibold',
    6: 'scroll-mt-32 text-slate-700 dark:text-slate-300 font-semibold',
  };

  return (
    <Tag id={slug} className={`group flex items-center justify-between ${baseStyles[level] || baseStyles[2]} ${sizeClasses}`} {...props}>
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

// Helper: Remove [!ALERT] markdown syntax from the rendered content inside blockquotes
function stripAlertPrefix(node) {
  if (typeof node === 'string') {
    return node.replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
  }
  if (Array.isArray(node)) {
    let replaced = false;
    return node.map((child) => {
      if (!replaced && (typeof child === 'string' || React.isValidElement(child))) {
        const cleaned = stripAlertPrefix(child);
        if (cleaned !== child) replaced = true;
        return cleaned;
      }
      return child;
    });
  }
  if (React.isValidElement(node) && node.props?.children) {
    return React.cloneElement(node, {
      ...node.props,
      children: stripAlertPrefix(node.props.children),
    });
  }
  return node;
}

// Callout / Blockquote with GitHub-Style Alerts
const Blockquote = ({ fontSize = 'normal', children, ...props }) => {
  const text = getChildrenText(children);
  const alertMatch = text.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);

  const textSize = {
    normal: 'text-[16px] sm:text-[17px] leading-[1.8]',
    large: 'text-[18px] sm:text-[19px] leading-[1.85]',
    xlarge: 'text-[20px] sm:text-[21px] leading-[1.9]',
  }[fontSize] || 'text-[16px] sm:text-[17px] leading-[1.8]';

  if (alertMatch) {
    const type = alertMatch[1].toUpperCase();
    const config = {
      NOTE: {
        border: 'border-blue-500',
        bg: 'bg-blue-50/80 dark:bg-blue-950/25',
        text: 'text-blue-950 dark:text-blue-100',
        badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60',
        icon: 'ℹ️',
        title: 'NOTE',
      },
      TIP: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-50/80 dark:bg-emerald-950/25',
        text: 'text-emerald-950 dark:text-emerald-100',
        badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
        icon: '💡',
        title: 'PRO TIP',
      },
      IMPORTANT: {
        border: 'border-purple-500',
        bg: 'bg-purple-50/80 dark:bg-purple-950/25',
        text: 'text-purple-950 dark:text-purple-100',
        badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60',
        icon: '🛡️',
        title: 'IMPORTANT',
      },
      WARNING: {
        border: 'border-amber-500',
        bg: 'bg-amber-50/80 dark:bg-amber-950/25',
        text: 'text-amber-950 dark:text-amber-100',
        badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
        icon: '⚠️',
        title: 'WARNING',
      },
      CAUTION: {
        border: 'border-rose-500',
        bg: 'bg-rose-50/80 dark:bg-rose-950/25',
        text: 'text-rose-950 dark:text-rose-100',
        badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60',
        icon: '🚨',
        title: 'SECURITY CAUTION',
      },
    }[type] || {
      border: 'border-purple-500',
      bg: 'bg-purple-50/80 dark:bg-purple-950/25',
      text: 'text-purple-950 dark:text-purple-100',
      badge: 'bg-purple-100 text-purple-800',
      icon: '🛡️',
      title: type,
    };

    return (
      <div className={`my-8 rounded-xl border-l-4 ${config.border} ${config.bg} p-5 sm:p-6 shadow-xs`}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${config.badge}`}>
            <span>{config.icon}</span>
            <span>{config.title}</span>
          </span>
        </div>
        <div className={`${textSize} ${config.text} [&>p:first-child]:mt-0 [&>p:last-child]:mb-0`}>
          {stripAlertPrefix(children)}
        </div>
      </div>
    );
  }

  return (
    <blockquote className={`rounded-r-xl border-l-4 border-purple-500 bg-purple-50/60 dark:bg-[#1f1930] py-4 px-6 my-8 text-slate-700 dark:text-slate-300 italic shadow-xs ${textSize}`} {...props}>
      {children}
    </blockquote>
  );
};

const MarkdownRenderer = ({ children, content, fontSize = 'normal', className = '' }) => {
  const rawInput = children !== undefined ? children : content;
  const markdownText = typeof rawInput === 'string'
    ? rawInput
    : (rawInput?.default && typeof rawInput.default === 'string'
      ? rawInput.default
      : String(rawInput || ''));

  const paragraphSize = {
    normal: 'text-[17px] leading-[1.85] my-5',
    large: 'text-[19px] leading-[1.9] my-6',
    xlarge: 'text-[21px] leading-[2.0] my-7',
  }[fontSize] || 'text-[17px] leading-[1.85] my-5';

  const listSize = {
    normal: 'text-[17px] leading-[1.8]',
    large: 'text-[19px] leading-[1.85]',
    xlarge: 'text-[21px] leading-[1.95]',
  }[fontSize] || 'text-[17px] leading-[1.8]';

  const components = useMemo(() => ({
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
          rawCode={rawCode}
        />
      );
    },
    code: ({ children: code, className: codeClassName, ...props }) => {
      return (
        <code
          className="rounded bg-slate-100 dark:bg-[#1f1b2e] px-1.5 py-0.5 text-[0.88em] font-mono font-semibold text-purple-700 dark:text-purple-300 border border-slate-200/80 dark:border-[#2e2747]"
          {...props}
        >
          {code}
        </code>
      );
    },
    h1: (props) => <Heading level={1} fontSize={fontSize} {...props} />,
    h2: (props) => <Heading level={2} fontSize={fontSize} {...props} />,
    h3: (props) => <Heading level={3} fontSize={fontSize} {...props} />,
    h4: (props) => <Heading level={4} fontSize={fontSize} {...props} />,
    h5: (props) => <Heading level={5} fontSize={fontSize} {...props} />,
    h6: (props) => <Heading level={6} fontSize={fontSize} {...props} />,
    p: ({ children: paragraph, ...props }) => (
      <p className={`text-slate-800 dark:text-slate-200 ${paragraphSize}`} {...props}>
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
          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline decoration-2 underline-offset-4"
          {...props}
        >
          {label}
        </a>
      );
    },
    blockquote: (props) => <Blockquote fontSize={fontSize} {...props} />,
    table: ({ children: rows, ...props }) => (
      <div className="my-10 w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left" {...props}>
          {rows}
        </table>
      </div>
    ),
    thead: ({ children: rows, ...props }) => (
      <thead className="bg-slate-100 dark:bg-[#1a1528] text-slate-900 dark:text-white font-bold text-xs sm:text-sm uppercase tracking-wider" {...props}>
        {rows}
      </thead>
    ),
    tbody: ({ children: rows, ...props }) => (
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#130f1c]" {...props}>
        {rows}
      </tbody>
    ),
    th: ({ children: value, ...props }) => (
      <th className="px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white" {...props}>
        {value}
      </th>
    ),
    td: ({ children: value, ...props }) => (
      <td className={`px-5 py-3.5 text-slate-800 dark:text-slate-200 ${listSize}`} {...props}>
        {value}
      </td>
    ),
    ul: ({ children: items, ...props }) => (
      <ul className="my-5 list-disc space-y-2.5 pl-6 sm:pl-8 text-slate-800 dark:text-slate-200" {...props}>
        {items}
      </ul>
    ),
    ol: ({ children: items, ...props }) => (
      <ol className="my-5 list-decimal space-y-2.5 pl-6 sm:pl-8 text-slate-800 dark:text-slate-200" {...props}>
        {items}
      </ol>
    ),
    li: ({ children: item, ...props }) => (
      <li className={`pl-1.5 leading-relaxed ${listSize}`} {...props}>{item}</li>
    ),
    hr: (props) => <hr className="my-10 border-slate-200 dark:border-slate-800" {...props} />,
    img: ({ src, alt = '', ...props }) => (
      <span className="my-8 block">
        <img
          src={src}
          alt={alt}
          className="mx-auto max-w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-md"
          loading="lazy"
          {...props}
        />
        {alt && <span className="mt-2.5 block text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">{alt}</span>}
      </span>
    ),
    strong: ({ children: value, ...props }) => (
      <strong className="font-bold text-slate-950 dark:text-white" {...props}>{value}</strong>
    ),
    em: ({ children: value, ...props }) => (
      <em className="italic text-purple-700 dark:text-purple-300" {...props}>{value}</em>
    ),
  }), [fontSize, paragraphSize, listSize]);

  return (
    <div className={`markdown-body w-full max-w-none text-slate-800 dark:text-slate-200 ${className}`}>
      <ReactMarkdown skipHtml components={components}>
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
