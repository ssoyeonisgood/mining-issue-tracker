import type { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'error' | 'empty'
}

export default function Alert({ children, variant = 'error' }: AlertProps) {
  return <div className={variant === 'error' ? 'alert-error' : 'alert-empty'}>{children}</div>
}
