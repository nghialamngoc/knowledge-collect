import React from 'react'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import Markdown from '@/components/Markdown'
import { getDictionary } from '../../dictionaries'
import { Article } from 'schema-dts'
import dynamic from 'next/dynamic'
import { Locales } from '@/types'
// import ClientComponent from '@/components/ClientComponent'

const ClientComponent = dynamic(() => import('@/components/ClientComponent'))

interface PageProps {
  params: Promise<{
    category: string
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const staticPages = [{ locale: 'en', category: 'performance', slug: 'web-performance-metrics' }]

  return staticPages
}

export const revalidate = 60

export default async function Page({ params }: PageProps) {
  try {
    const { category, slug, locale } = await params

    //
    const dict = await getDictionary(locale as Locales)

    console.log('dict', dict.title)

    const filePath = path.join(process.cwd(), 'src', 'data', category, `${slug}.md`)

    const fileContent = fs.readFileSync(filePath, 'utf8')

    if (!fileContent) {
      return notFound()
    }

    const { data: frontmatter, content } = matter(fileContent)

    const jsonLd: Article = {
      '@type': 'Article',
      name: frontmatter.title,
      image: frontmatter.image,
      description: frontmatter.description
    }

    return (
      <section>
        {/* Add JSON-LD to your page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
          }}
        />

        <div className="max-w-4xl mx-auto p-6">
          {Object.keys(frontmatter).length > 0 && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📄 Document Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(frontmatter).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key}</span>
                    <span className="text-gray-800 font-medium mt-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <article className="prose prose-lg max-w-none">
            <Markdown content={content} />
          </article>
          <ClientComponent />
        </div>
      </section>
    )
  } catch (err) {
    console.error('Error loading Markdown:', err)
    notFound()
  }
}
