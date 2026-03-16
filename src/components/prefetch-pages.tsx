'use client'

import { useEffect, useRef } from 'react'

/**
 * Prefetch component: fires cache-warming requests in the background.
 * Runs ONCE after mount — each URL triggers a server-side render that
 * populates unstable_cache, so subsequent real navigations are instant.
 */
export function PrefetchPages({ paths }: { paths: string[] }) {
    const fired = useRef(false)

    useEffect(() => {
        if (fired.current) return
        fired.current = true

        // Use requestIdleCallback so we don't block the main thread
        const warm = () => {
            for (const path of paths) {
                fetch(path, {
                    priority: 'low' as any,
                    headers: { 'x-purpose': 'prefetch' },
                }).catch(() => { })
            }
        }

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(warm, { timeout: 3000 })
        } else {
            setTimeout(warm, 1000)
        }
    }, [paths])

    return null
}
