import React from 'react'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import Markdown from '@/components/Markdown'
import { Article } from 'schema-dts'
import OnThisPageSection from '@/components/OnThisPageSection'

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const staticPages = [{ category: 'performance', slug: 'web-performance-metrics' }]

  return staticPages
}

export const revalidate = 60

export default async function Page({ params }: PageProps) {
  try {
    const { category, slug } = await params

    const filePath = path.join(process.cwd(), 'src', 'data', category, `${slug}.md`)

    const fileContent = fs.readFileSync(filePath, 'utf8')

    if (!fileContent) {
      return notFound()
    }

    const {
      data: { onThisPage, ...postInfo },
      content
    } = matter(fileContent)

    const jsonLd: Article = {
      '@type': 'Article',
      name: postInfo.title,
      image: postInfo.image,
      description: postInfo.description
    }

    return (
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
          }}
        />

        <div className="lg:px-4 xl:px-12 py-6 flex justify-center">
          <div className="hidden xl:block w-40 shrink-0">123</div>
          <div className="lg:max-w-3xl xl:max-w-4xl px-6">
            <article>
              <Markdown content={content} />
            </article>
            {/*
            <ClientComponent /> */}
          </div>
          <div className="hidden lg:block w-55 shrink-0 sticky h-fit top-10">
            <OnThisPageSection data={onThisPage} />
          </div>
        </div>
      </section>
    )
  } catch (err) {
    console.error('Error loading Markdown:', err)
    notFound()
  }
}
