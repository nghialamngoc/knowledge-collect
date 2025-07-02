'use client'

import { useModalContext } from '@/context/ModalContext'

export default function Page() {
  const { openModal } = useModalContext()

  return (
    <div>
      <button
        onClick={() => {
          openModal({
            content: (
              <div>
                <div>Modal 1</div>
                <div>
                  <button
                    onClick={() => {
                      openModal({
                        content: 'sub modal'
                      })
                    }}
                  >
                    Open another Modal
                  </button>
                </div>
              </div>
            )
          })
        }}
      >
        Modal 1
      </button>
    </div>
  )
}
