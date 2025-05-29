'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock = ({ language = 'tsx', value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-md border text-sm">
      <div className="flex justify-between items-center px-4 py-2 border-b-1">
        <div className=" text-gray-500">{language}</div>

        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy}>
          <Copy className={cn('h-4 w-4', copied ? 'text-green-500' : 'text-gray-500')} />
        </Button>
      </div>

      <SyntaxHighlighter
        language={language === 'tsx' ? 'typescript' : language}
        style={prism}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem'
        }}
        wrapLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
