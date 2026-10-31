import React, { useMemo } from 'react';
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
    <div className="my-8 rounded-xl border border-slate-200/90 dark:border-[#2e2747] bg-white dark:bg-[#130f1c] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#1a1528] border-b border-slate-200 dark:border-[#26203b] text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold">
            Architecture Topology Diagram
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
          Pele Vector SVG
        </span>
      </div>
      <div className="blueprint-canvas p-6 flex justify-center items-center overflow-x-auto min-h-[160px]">
        <div
          className="pele-svg-container w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      </div>
    </div>
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
            const className = isCode ? codeElement.props.className || '' : '';
            const match = /language-(\w+)/.exec(className);
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
                trimmed.startsWith('flowchart') ||
                trimmed.startsWith('graph') ||
                trimmed.startsWith('sequenceDiagram') ||
                trimmed.startsWith('stateDiagram') ||
                trimmed.startsWith('erDiagram');

              if (isDiagram) {
                return <PeleDiagram code={trimmed} language={language} />;
              }
            }

            return (
              <div className="relative my-7 overflow-hidden rounded-xl border border-slate-200 dark:border-[#2e2747] bg-slate-900 dark:bg-[#0c0915] shadow-xs">
                {language && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-slate-800/90 dark:bg-[#1a1728] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-300 dark:text-slate-400 border-b border-l border-slate-700/50 dark:border-slate-800">
                    {language}
                  </div>
                )}
                <pre className="overflow-x-auto p-5 text-[0.9rem] leading-relaxed text-slate-200 font-mono">
                  {codeElement}
                </pre>
              </div>
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
          h1: ({ children: heading, ...props }) => (
            <h1 className="scroll-mt-20 text-slate-900 dark:text-white font-extrabold text-2xl sm:text-3xl mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3" {...props}>
              {heading}
            </h1>
          ),
          h2: ({ children: heading, ...props }) => (
            <h2 className="scroll-mt-20 text-slate-900 dark:text-white font-bold text-xl sm:text-2xl mt-8 mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2" {...props}>
              {heading}
            </h2>
          ),
          h3: ({ children: heading, ...props }) => (
            <h3 className="scroll-mt-20 text-slate-900 dark:text-slate-100 font-bold text-lg sm:text-xl mt-6 mb-2" {...props}>
              {heading}
            </h3>
          ),
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
          blockquote: ({ children: quote, ...props }) => (
            <blockquote className="rounded-r-xl border-l-4 border-purple-500 bg-purple-50/60 dark:bg-purple-950/20 py-3 px-4 my-6 text-slate-700 dark:text-slate-300 italic" {...props}>
              {quote}
            </blockquote>
          ),
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
