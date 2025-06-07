import { Locales } from '@/types'
import 'server-only'

const dictionaries = {
  en: () => import('@/translations/en.json').then(module => module.default),
  zh: () => import('@/translations/zh.json').then(module => module.default)
}

export const getDictionary = async (locale: Locales) => dictionaries[locale]?.()
