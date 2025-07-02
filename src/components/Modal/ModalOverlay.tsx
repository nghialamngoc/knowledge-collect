import { useModalContext } from '@/context/ModalContext'
import { cn } from '@/lib/utils'
import { HTMLMotionProps, motion } from 'framer-motion'
import { MouseEventHandler, forwardRef } from 'react'

export const ModalOverlay = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(function DialogOverlay(props, ref) {
  const { currentModal, closeModal } = useModalContext()

  const onOverlayClick: MouseEventHandler<HTMLDivElement> = () => {
    closeModal()
  }

  return (
    <motion.div
      ref={ref}
      data-part="modal-overlay"
      {...props}
      className={cn(currentModal?.classes?.overlay, 'fixed inset-0 bg-[#183028] opacity-90')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      onClick={onOverlayClick}
    />
  )
})
