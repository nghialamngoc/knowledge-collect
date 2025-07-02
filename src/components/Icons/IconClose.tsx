import { FC, SVGProps } from 'react'

export const IconClose: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default IconClose
