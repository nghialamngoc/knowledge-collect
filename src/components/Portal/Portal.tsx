import { FC, ReactNode, RefObject, createElement, useEffect, useReducer, useRef } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = {
  children: ReactNode
  target?: RefObject<HTMLElement>
}

export const Portal: FC<PortalProps> = props => {
  const { children, target } = props
  const node = useRef<HTMLDivElement | null>(null)
  const portalNode = useRef<HTMLElement | null>(null)
  const [, forceUpdate] = useReducer(s => s + 1, 0)

  useEffect(() => {
    if (!node.current) return
    const doc = node.current.ownerDocument
    portalNode.current = doc.createElement('portal')
    doc.body.appendChild(portalNode.current)

    forceUpdate()

    return () => {
      if (portalNode.current) {
        doc.body.removeChild(portalNode.current)
      }
    }
  }, [])

  const targetNode = target?.current ?? portalNode.current

  if (targetNode) {
    return createPortal(children, targetNode)
  }

  return createElement('span', { ref: node })
}
