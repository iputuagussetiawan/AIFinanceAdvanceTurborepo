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

const CV = ({ mode = 'manage', onChange }: CVProps) => {
    const targetRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isPreviewing, setIsPreviewing] = useState(false)

    const handleDownload = () => {
        if (isDownloading) return
        setIsDownloading(true)
        const options: Options = {
            filename: 'my-resume.pdf',
            method: 'save',
            resolution: Resolution.HIGH,
            page: {
                margin: Margin.NONE,
                format: 'A4',
                orientation: 'portrait',
            },
            canvas: {
                mimeType: 'image/png',
                qualityRatio: 1,
            },
            overrides: {
                pdf: {
                    compress: false,
                },
                canvas: {
                    useCORS: true,
                    backgroundColor: '#ffffff',
                },
            },
        }

        setTimeout(() => {
            if (targetRef.current) {
                generatePDF(targetRef, options)
            }
            setTimeout(() => {
                setIsDownloading(false)
            }, 1500)
        }, 250)
    }

    const handlePreview = () => {
        if (isPreviewing) return
        setIsPreviewing(true)
        const options: Options = {
            filename: 'my-resume.pdf',
            method: 'open',
            resolution: Resolution.HIGH,
            page: {
                margin: Margin.NONE,
                format: 'A4',
                orientation: 'portrait',
            },
            canvas: {
                mimeType: 'image/png',
                qualityRatio: 1,
            },
            overrides: {
                pdf: {
                    compress: false,
                },
                canvas: {
                    useCORS: true,
                    backgroundColor: '#ffffff',
                },
            },
        }

        setTimeout(() => {
            if (targetRef.current) {
                generatePDF(targetRef, options)
            }
            setTimeout(() => {
                setIsPreviewing(false)
            }, 1500)
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
