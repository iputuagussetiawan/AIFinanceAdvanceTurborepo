import React from 'react'

import ResumeFooter from './ResumeFooter'
import ResumeHeader from './ResumeHeader'

const ResumeWrapper = ({
    children,
    pageNumber,
    totalPages,
}: {
    children: React.ReactNode
    pageNumber: number
    totalPages: number
}) => {
    return (
        <div className="wrapper relative" style={{ width: '794px', height: '1122.5px' }}>
            <ResumeHeader />
            {children}
            <ResumeFooter
                pageNumber={pageNumber}
                totalPages={totalPages}
                userName="Brock Henrecks"
            />
        </div>
    )
}

export default ResumeWrapper
