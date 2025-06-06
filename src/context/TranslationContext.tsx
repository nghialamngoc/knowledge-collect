import { createContext } from '@/utils/create-context'
import { TranslationData } from '@/types'

export const [TranslationProvider, useTranslationContext] = createContext((props: TranslationData) => props)
