import React from 'react'

interface CVFooterProps {
    pageNumber: number
    totalPages: number
    userName?: string
}

const CVFooter = ({
    pageNumber,
    totalPages,
    userName = 'Brock Henrecks',
}: CVFooterProps) => {
    return (
        <footer
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0 48px 32px 48px',
                backgroundColor: 'transparent',
            }}
        >
            <div
                style={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: '#d1d5db',
                    marginBottom: '8px',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                <span style={{ color: '#9ca3af' }}>{userName} — Curriculum Vitae</span>
                <span style={{ color: '#4b5563', fontWeight: 'bold' }}>
                    Page {pageNumber} of {totalPages}
                </span>
            </div>
        </footer>
    )
}

export default CVFooter
