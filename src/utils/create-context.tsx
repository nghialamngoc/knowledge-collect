import { createContext as createReactContext, useContext, ReactNode } from 'react'

export const createContext = <Context, Props>(
  useGetContextValue: (props: Props) => Context,
  defaultContext?: Context
) => {
  const Ctx = createReactContext<Context | undefined>(defaultContext)

  const Provider = (props: Props & { children: ReactNode }) => {
    const value = useGetContextValue(props)

    return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
  }

  const useThisContext = () => {
    const ctx = useContext(Ctx)

    if (ctx === undefined) {
      throw new Error('This hook must be used a child of its Provider')
    }

    return ctx
  }

  return [Provider, useThisContext] as const
}
