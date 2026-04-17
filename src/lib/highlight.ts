import type { ReactNode } from 'react'
import { createElement, Fragment } from 'react'

const HIGHLIGHT_CLASS = 'bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5'

export function highlightText(text: string, query: string): ReactNode {
  if (!text) return text
  const trimmed = query?.trim() ?? ''
  if (!trimmed) return text

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      i % 2 === 1
        ? createElement('mark', { key: i, className: HIGHLIGHT_CLASS }, part)
        : part
    )
  )
}
