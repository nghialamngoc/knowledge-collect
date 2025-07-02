import { forwardRef, HTMLProps } from 'react'
import styles from './ModalContent.module.css'
import { useModalContext } from '@/context/ModalContext'
import { cn } from '@/lib/utils'

export const ModalContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(function DialogContent(props, ref) {
  const { children, className, ...rest } = props
  const { currentModal } = useModalContext()
  const { size } = currentModal || {}

  console.log('a', [undefined, 'md'].includes(size))

  return (
    <div
      ref={ref}
      data-part="modal-content"
      data-testid="ModalContent"
      className={cn(
        styles.content,
        'flex flex-col gap-4 relative bg-white w-full',
        'py-4 mx-4 rounded-2xl',
        'md:py-6 md:gap-4',
        'lg:py-8',
        {
          [styles.sm]: size === 'sm',
          [styles.md]: [undefined, 'md'].includes(size),
          [styles.lg]: size === 'lg',
          [styles.full]: size === 'full'
        },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
})
