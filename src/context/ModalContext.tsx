'use client'

import { ModalCloseButton } from '@/components/Modal/ModalCloseButton'
import { ModalContent } from '@/components/Modal/ModalContent'
import { ModalOverlay } from '@/components/Modal/ModalOverlay'
import { ModalRoot } from '@/components/Modal/ModalRoot'
import React, { ReactNode, createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

// Types
export interface ModalConfig {
  id?: string
  title?: string
  content: ReactNode
  onClose?: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  showConfirm?: boolean
  closable?: boolean
  className?: string
  classes?: {
    overlay?: string
    content?: string
    header?: string
    footer?: string
  }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  position?: 'center' | 'top' | 'bottom'
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none'
}

interface ModalData extends ModalConfig {
  id: string
}

interface ModalContextType {
  isOpen: boolean
  currentModal: ModalData | null
  modals: ModalData[]
  openModal: (config: ModalConfig) => string
  closeModal: (id?: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<ModalConfig>) => void
  goBack: () => void
  getCount: () => number
}

// Create Context
const ModalContext = createContext<ModalContextType | null>(null)

// Custom Hook to use Modal Context
export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}

// Modal Container Component
const ModalContainer: React.FC<{ modals: ModalData[] }> = ({ modals }) => {
  const [mounted, setMounted] = useState(false)
  const { closeModal } = useModalContext()

  // Mount check for SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const currentModal = modals[modals.length - 1]
        if (currentModal?.closable !== false) {
          closeModal()
        }
      }
    }

    if (modals.length > 0) {
      document.addEventListener('keydown', handleEsc)
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [modals, closeModal])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // Don't render on server or if no modals
  if (!mounted || modals.length === 0) return null

  return (
    <ModalRoot>
      {/* Overlay */}
      <ModalOverlay />

      <ModalCloseButton />

      <ModalContent>
        <div className="xs:text-2xl">123</div>
      </ModalContent>
    </ModalRoot>
  )
}

// Modal Provider Component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalData[]>([])
  const idCounterRef = useRef(0)

  // Generate unique ID
  const generateId = useCallback(() => {
    return `modal_${Date.now()}_${++idCounterRef.current}`
  }, [])

  // Open modal
  const openModal = useCallback(
    (config: ModalConfig): string => {
      const id = config.id || generateId()

      const modalData: ModalData = {
        closable: true,
        showCancel: true,
        showConfirm: false,
        size: 'md',
        position: 'center',
        animation: 'fade',
        ...config,
        id
      }

      setModals(prev => [...prev, modalData])
      return id
    },
    [generateId]
  )

  // Close modal
  const closeModal = useCallback((id?: string) => {
    console.log('hể')

    setModals(prev => {
      if (prev.length === 0) return prev

      if (!id) {
        // Close current modal (last in stack)
        const currentModal = prev[prev.length - 1]
        currentModal.onClose?.()
        return prev.slice(0, -1)
      }

      // Close specific modal
      const index = prev.findIndex(modal => modal.id === id)
      if (index === -1) return prev

      const modal = prev[index]
      modal.onClose?.()
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  // Close all modals
  const closeAllModals = useCallback(() => {
    setModals(prev => {
      prev.forEach(modal => modal.onClose?.())
      return []
    })
  }, [])

  // Update modal
  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev => prev.map(modal => (modal.id === id ? { ...modal, ...updates } : modal)))
  }, [])

  // Go back (close current modal)
  const goBack = useCallback(() => {
    closeModal()
  }, [closeModal])

  // Get modal count
  const getCount = useCallback(() => modals.length, [modals.length])

  // Check if any modal is open
  const isOpen = modals.length > 0

  const currentModal = modals.length > 0 ? modals[modals.length - 1] : null

  const contextValue: ModalContextType = {
    isOpen,
    modals,
    currentModal,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    goBack,
    getCount
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ModalContainer modals={modals} />
    </ModalContext.Provider>
  )
}
