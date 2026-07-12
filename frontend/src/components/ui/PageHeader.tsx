import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header flex flex-col gap-4 border-b border-[var(--color-border-subtle)] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="page-eyebrow page-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="page-title page-header__title">{title}</h2>
        {description ? (
          <p className="page-description page-header__description">{description}</p>
        ) : null}
      </div>
      {action ? <div className="page-header__action shrink-0">{action}</div> : null}
    </div>
  )
}
