import React from 'react'

import CVFooter from './CVFooter'
import CVHeader from './CVHeader'

const CVWrapper = ({
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
            <CVHeader />
            {children}
            <CVFooter
                pageNumber={pageNumber}
                totalPages={totalPages}
                userName="Brock Henrecks"
            />
        </div>
    )
}

export default CVWrapper
