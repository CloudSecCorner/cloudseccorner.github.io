import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ children, className = '' }) => (
  <div className={`prose prose-invert max-w-none ${className}`}>
    <ReactMarkdown
      skipHtml
      components={{
        pre: ({ children: code }) => {
          const languageClass = React.isValidElement(code) ? code.props.className : '';
          const language = /language-(\w+)/.exec(languageClass || '')?.[1];

          return (
            <div className="relative my-7 overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117] shadow-md">
              {language && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-gray-800/90 px-4 py-2 text-xs uppercase tracking-wider text-gray-400">
                  {language}
                </div>
              )}
              <pre className="overflow-x-auto p-6 text-[0.95rem] leading-relaxed text-[#c9d1d9]">
                {code}
              </pre>
            </div>
          );
        },
        code: ({ children: code, className: codeClassName, ...props }) => (
          <code
            className={codeClassName || 'rounded bg-[#1f2937] px-1 py-0.5 text-sm text-[#79c0ff]'}
            {...props}
          >
            {code}
          </code>
        ),
        h1: ({ children: heading, ...props }) => (
          <h1 className="scroll-mt-20" {...props}>{heading}</h1>
        ),
        h2: ({ children: heading, ...props }) => (
          <h2 className="scroll-mt-20" {...props}>{heading}</h2>
        ),
        h3: ({ children: heading, ...props }) => (
          <h3 className="scroll-mt-20" {...props}>{heading}</h3>
        ),
        a: ({ href = '', children: label, ...props }) => {
          const external = /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="text-blue-500 hover:underline"
              {...props}
            >
              {label}
            </a>
          );
        },
        blockquote: ({ children: quote, ...props }) => (
          <blockquote className="rounded-r-md border-l-4 border-blue-500 bg-gray-800/30 py-1 pl-4 italic" {...props}>
            {quote}
          </blockquote>
        ),
        table: ({ children: rows, ...props }) => (
          <div className="my-8 overflow-x-auto rounded-md border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700" {...props}>{rows}</table>
          </div>
        ),
        thead: ({ children: rows, ...props }) => (
          <thead className="bg-gray-800" {...props}>{rows}</thead>
        ),
        tbody: ({ children: rows, ...props }) => (
          <tbody className="divide-y divide-gray-700 bg-gray-900/30" {...props}>{rows}</tbody>
        ),
        th: ({ children: value, ...props }) => (
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300" {...props}>{value}</th>
        ),
        td: ({ children: value, ...props }) => (
          <td className="px-4 py-3 text-sm" {...props}>{value}</td>
        ),
        ul: ({ children: items, ...props }) => (
          <ul className="my-4 list-disc space-y-2 pl-6" {...props}>{items}</ul>
        ),
        ol: ({ children: items, ...props }) => (
          <ol className="my-4 list-decimal space-y-2 pl-6" {...props}>{items}</ol>
        ),
        li: ({ children: item, ...props }) => <li className="pl-2" {...props}>{item}</li>,
        hr: (props) => <hr className="my-8 border-gray-700" {...props} />,
        img: ({ src, alt = '', ...props }) => (
          <span className="my-6 block">
            <img
              src={src}
              alt={alt}
              className="mx-auto max-w-full rounded-md border border-gray-700"
              loading="lazy"
              {...props}
            />
            {alt && <span className="mt-2 block text-center text-sm text-gray-500">{alt}</span>}
          </span>
        ),
        strong: ({ children: value, ...props }) => (
          <strong className="font-bold text-blue-300" {...props}>{value}</strong>
        ),
        em: ({ children: value, ...props }) => (
          <em className="italic text-yellow-300" {...props}>{value}</em>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default MarkdownRenderer;
