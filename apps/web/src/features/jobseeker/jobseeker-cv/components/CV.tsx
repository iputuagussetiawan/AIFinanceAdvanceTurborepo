'use client'

import { useRef, useState } from 'react'
import generatePDF, { Margin, Resolution, type Options } from 'react-to-pdf'

import type { ResumeMode } from '@/lib/constants'

import CVToolbar from './CVToolbar'
import CVAbout from './template/v1/CVAbout'
import CVExpOne from './template/v1/CVExpOne'
import CVWrapper from './template/v1/CVWrapper'
import CVExpTwo from './template/v1/CVExpTwo'

interface ResumeData {
    about: any
    experiences: any[]
}

interface CVProps {
    mode?: ResumeMode
    onChange?: (newData: ResumeData) => void
}

const MODERN_COLOR_FNS = ['oklch(', 'oklab(', 'lab(', 'lch(', 'color-mix(', 'light-dark(']

const toRgb = (color: string): string => {
    try {
        const c = document.createElement('canvas')
        c.width = c.height = 1
        const ctx = c.getContext('2d')!
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        return a === 255 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${+(a / 255).toFixed(3)})`
    } catch {
        return 'rgb(0,0,0)'
    }
}

const fixModernColors = (el: Element) => {
    const computed = window.getComputedStyle(el)
    const htmlEl = el as HTMLElement
    const props = [
        'color', 'backgroundColor', 'borderTopColor', 'borderRightColor',
        'borderBottomColor', 'borderLeftColor', 'outlineColor',
    ] as const
    props.forEach(prop => {
        const val = computed[prop]
        if (val && MODERN_COLOR_FNS.some(fn => val.includes(fn))) {
            htmlEl.style[prop] = toRgb(val)
        }
    })
    Array.from(el.children).forEach(fixModernColors)
}

const pdfOptions = (method: 'save' | 'open'): Options => ({
    filename: 'my-resume.pdf',
    method,
    resolution: Resolution.HIGH,
    page: { margin: Margin.NONE, format: 'A4', orientation: 'portrait' },
    canvas: { mimeType: 'image/png', qualityRatio: 1 },
    overrides: {
        pdf: { compress: false },
        canvas: { useCORS: true, backgroundColor: '#ffffff' },
    },
})

const CV = ({ mode = 'manage', onChange }: CVProps) => {
    const targetRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isPreviewing, setIsPreviewing] = useState(false)

    const handleDownload = () => {
        if (isDownloading) return
        setIsDownloading(true)

        setTimeout(() => {
            if (targetRef.current) {
                fixModernColors(targetRef.current)
                generatePDF(targetRef, pdfOptions('save'))
            }
            setTimeout(() => setIsDownloading(false), 1500)
        }, 250)
    }

    const handlePreview = () => {
        if (isPreviewing) return
        setIsPreviewing(true)

        setTimeout(() => {
            if (targetRef.current) {
                fixModernColors(targetRef.current)
                generatePDF(targetRef, pdfOptions('open'))
            }
            setTimeout(() => setIsPreviewing(false), 1500)
        }, 250)
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-8">
            <div
                ref={targetRef}
                className="mb-4"
                style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                }}
            >
                <CVWrapper pageNumber={1} totalPages={2}>
                    <CVAbout />
                    <CVExpOne />
                </CVWrapper>
                <CVWrapper pageNumber={2} totalPages={2}>
                    <CVExpTwo />
                </CVWrapper>
            </div>

            <CVToolbar
                currentMode={mode}
                onPreview={handlePreview}
                onDownload={handleDownload}
                isPreviewing={isPreviewing}
                isLoading={isDownloading}
            />
        </div>
    )
}

export default CV
