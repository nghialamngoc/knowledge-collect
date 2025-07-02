import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useModalContext } from '@/context/ModalContext'
import { Portal } from '../Portal'

export interface DialogRootProps {
  id?: string
  className?: string
  children?: ReactNode
}

export const ModalRoot = ({ id, children }: DialogRootProps) => {
  const { currentModal } = useModalContext()

  return (
    <AnimatePresence>
      {currentModal && (
        <Portal>
          <div
            id={id}
            data-part="dialog-root"
            className="fixed inset-0 w-screen h-dvh z-[1000] overflow-auto overscroll-none flex items-center justify-center"
          >
            {children}
          </div>
        </Portal>
      )}
    </AnimatePresence>
  )
}
