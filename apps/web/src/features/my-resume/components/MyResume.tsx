'use client'

import { useRef, useState } from 'react'
import generatePDF, { Margin, Resolution, type Options } from 'react-to-pdf'

import type { ResumeMode } from '@/lib/constants'

import MyResumeToolbar from './MyResumeToolbar'
import ResumeAbout from './template/v1/ResumeAbout'
import ResumeExpOne from './template/v1/ResumeExpOne'
import ResumeWrapper from './template/v1/ResumeWrapper'

interface ResumeData {
    about: any
    experiences: any[]
}

interface MyResumeProps {
    mode?: ResumeMode
    onChange?: (newData: ResumeData) => void
}

const MyResume = ({ mode = 'manage', onChange }: MyResumeProps) => {
    const targetRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isPreviewing, setIsPreviewing] = useState(false)

    // 1. Separate Function to handle download with a small delay for stability
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

        // Delay execution slightly to ensure DOM is fully ready
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

        // Delay execution slightly to ensure DOM is fully ready
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
                <ResumeWrapper pageNumber={1} totalPages={2}>
                    <ResumeAbout />
                    <ResumeExpOne />
                </ResumeWrapper>
                <ResumeWrapper pageNumber={2} totalPages={2}>
                    <ResumeExpOne />
                </ResumeWrapper>
            </div>

            <MyResumeToolbar
                currentMode={mode}
                onPreview={handlePreview}
                onDownload={handleDownload}
                isPreviewing={isPreviewing}
                isLoading={isDownloading}
            />
        </div>
    )
}

export default MyResume
