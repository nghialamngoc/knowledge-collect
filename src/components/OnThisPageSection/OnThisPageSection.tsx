'use client'

import useElementsInView from '@/hooks/useElementsInView'
import { cn } from '@/lib/utils'
import { OnThisPageItem } from '@/types'
import { converStringToId } from '@/utils/string'
import Link from 'next/link'
import { FC, useMemo } from 'react'

export interface OnThisPageSectionProps {
  data: OnThisPageItem[]
  className?: string
}

const flattenOnThisPageItems = (items: OnThisPageItem[]) => {
  const result: string[] = []

  items.forEach(item => {
    result.push(item.href?.substring(1) ?? converStringToId(item.title ?? ''))

    if (item.childs && item.childs.length > 0) {
      result.push(...flattenOnThisPageItems(item.childs))
    }
  })

  return result
}

export const OnThisPageSection: FC<OnThisPageSectionProps> = ({ data }) => {
  const ids = useMemo(() => {
    return flattenOnThisPageItems(data)
  }, [data])

  const { isVisible } = useElementsInView(ids)

  return (
    <>
      {data.map((item, i) => {
        const id = item.href?.substring(1) ?? converStringToId(item.title ?? '')

        return (
          <div key={i}>
            <Link
              className={cn(
                'text-sm block mb-2 text-gray-600 hover:text-black',
                isVisible(id) && 'font-semibold text-black'
              )}
              href={`#${id}`}
            >
              {item.title}
            </Link>

            {item.childs?.map((child, j) => {
              const childId = child.href?.substring(1) ?? converStringToId(child.title ?? '')
              return (
                <Link
                  key={j}
                  className={cn(
                    'text-sm pl-1 block py-2 text-gray-600 hover:text-black',
                    isVisible(childId) && 'font-semibold text-black'
                  )}
                  href={`#${childId}`}
                >
                  {child.title}
                </Link>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
