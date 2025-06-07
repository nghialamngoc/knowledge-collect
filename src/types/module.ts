export interface AppData {
  locale: string
}

export type Locales = 'en' | 'zh'

export interface TranslationData {
  langDict: Record<string, string>
}

export interface OnThisPageItem {
  title?: string
  href?: string
  childs?: OnThisPageItem[]
}
