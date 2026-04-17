'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  text?: string
}

export function ShareButton({ title, text = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (typeof window === 'undefined') return
    const url = window.location.href
    const nav = window.navigator

    try {
      if ('share' in nav && typeof nav.share === 'function') {
        await nav.share({ title, text, url })
        return
      }
      if (nav.clipboard?.writeText) {
        await nav.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleShare}
      aria-label={copied ? 'URL 복사 완료' : '이 책 공유하기'}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{copied ? '복사됨' : '공유'}</span>
    </Button>
  )
}
