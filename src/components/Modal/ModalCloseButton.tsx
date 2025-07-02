import { useModalContext } from '@/context/ModalContext'
import { HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef, MouseEventHandler } from 'react'
import IconClose from '@/components/Icons/IconClose'

export const ModalCloseButton = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(function ModalCloseButton(
  props,
  ref
) {
  const { onClick, ...rest } = props
  const { closeModal } = useModalContext()

  const onCloseClick: MouseEventHandler<HTMLButtonElement> = e => {
    closeModal()
    onClick?.(e)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      data-part="modal-close-button"
      className="fixed top-16 right-16 p-2 border-0 rounded-3xl z-10 flex items-center justify-center cursor-pointer shadow-2xs text-black bg-white hover:text-white hover:bg-[#e87722]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      {...rest}
      onClick={onCloseClick}
    >
      <IconClose className="w-5 h-5" />
    </motion.button>
  )
})
