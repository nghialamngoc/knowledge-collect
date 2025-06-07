import { useEffect, useRef, useState } from 'react'

const useElementsInView = (ids: string[], options = {}) => {
  const [visibleElements, setVisibleElements] = useState(new Set())
  const elementsRef = useRef<Record<string, HTMLElement>>({})

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // Element phải hiển thị ít nhất 30%
      rootMargin: '0px',
      ...options
    }

    const observer = new IntersectionObserver(entries => {
      setVisibleElements(prev => {
        const newVisible = new Set(prev)

        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-id')
          if (entry.isIntersecting) {
            newVisible.add(id)
          } else {
            newVisible.delete(id)
          }
        })

        return newVisible
      })
    }, observerOptions)

    // Observe tất cả elements
    ids.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        element.setAttribute('data-id', id)
        observer.observe(element)
        elementsRef.current[id] = element
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [ids])

  return {
    visibleElements: Array.from(visibleElements),
    isVisible: (id: string) => visibleElements.has(id)
  }
}

export default useElementsInView
