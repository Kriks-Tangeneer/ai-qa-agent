import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreview({ content }) {

  // Copy-to-clipboard handler
  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="markdown-body text-gray-900 dark:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const codeText = String(children).trim();

            if (inline) {
              return (
                <code
                  className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative group">
                {/* Copy Button */}
                <button
                  onClick={() => copy(codeText)}
                  className="
                    absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                    transition bg-gray-300 dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 text-xs px-2 py-1 rounded
                    hover:bg-gray-400 dark:hover:bg-gray-600
                  "
                >
                  Copy
                </button>

                <pre className="rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
