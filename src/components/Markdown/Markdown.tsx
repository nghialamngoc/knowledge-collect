/* eslint-disable */
import { MDXRemote } from 'next-mdx-remote/rsc'
import React, { FC } from 'react'
import remarkGfm from 'remark-gfm'
import CodeBlock from '../CodeBlock'

export interface MarkdownProps {
  content: string
}

export const Markdown: FC<MarkdownProps> = ({ content }) => {
  const components = {
    h1: (props: any) => <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold mb-3" {...props} />,
    h3: (props: any) => <h2 className="text-xl font-semibold mb-2" {...props} />,
    h4: (props: any) => <h2 className="text-lg font-semibold mb-2" {...props} />,
    strong: (props: any) => <strong className="font-semibold" {...props}></strong>,
    hr: () => <hr className="mb-4" />,
    p: (props: any) => <p className="mb-1 leading-relaxed" {...props} />,
    code: (props: any) => <code className="text-sm px-1 rounded-sm bg-orange-100 text-orange-800" {...props} />,
    pre: ({ children, ...props }: any) => {
      const codeElement = React.Children.toArray(children)[0] as React.ReactElement
      if (codeElement && codeElement.props) {
        const { children: code, className } = codeElement.props as any
        const language = className?.replace('language-', '') || 'tsx'

        return <CodeBlock language={language} value={String(code).trim()} />
      }

      return <pre {...props}>{children}</pre>
    },
    ul: (props: any) => <ul className="mb-3" {...props} />,
    li: ({ children, ...props }: any) => {
      const firstEl = React.Children.toArray(children)[0]

      if (typeof firstEl === 'string' && firstEl.startsWith('-')) {
        return (
          <li className="pl-3 pb-1 last-of-type:pb-0">
            - {firstEl.substring(1)} {React.Children.toArray(children).slice(1)}
          </li>
        )
      }

      return (
        <li className="pb-1 last-of-type:pb-0" {...props}>
          {children}
        </li>
      )
    },
    table: ({ children }: any) => {
      return (
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm text-left text-gray-700 border-collapse shadow-md border border-gray-200">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                {children?.[0]?.props?.children?.props?.children?.map((th: any, index: number) => (
                  <th key={index} className="px-4 py-2 sm:px-6 sm:py-3 font-semibold border-r border-gray-200">
                    {th.props.children}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children.slice(1)?.[0]?.props?.children?.map((row: any, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 hover:bg-gray-50 even:bg-white odd:bg-gray-50 transition-colors"
                >
                  {row.props.children.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-2 sm:px-6 sm:py-3 border-r border-gray-200">
                      {cell.props.children}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }

  return (
    <MDXRemote
      source={content}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm]
        }
      }}
      components={components}
    />
  )
}
