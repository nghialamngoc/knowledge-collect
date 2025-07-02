import { FC, SVGProps } from 'react'

export const IconTrash: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M9.99805 3V4H4.99805V6H5.99805V19C5.99805 19.5304 6.20876 20.0391 6.58383 20.4142C6.95891 20.7893 7.46761 21 7.99805 21H17.998C18.5285 21 19.0372 20.7893 19.4123 20.4142C19.7873 20.0391 19.998 19.5304 19.998 19V6H20.998V4H15.998V3H9.99805ZM7.99805 6H17.998V19H7.99805V6ZM9.99805 8V17H11.998V8H9.99805ZM13.998 8V17H15.998V8H13.998Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default IconTrash
