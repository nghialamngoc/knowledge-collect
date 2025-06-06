import { createContext } from '@/utils/create-context'
import { AppData } from '@/types'

export const [AppProvider, useAppContext] = createContext((props: AppData) => props)
