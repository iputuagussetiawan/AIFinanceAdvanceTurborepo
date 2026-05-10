export interface IExperience {
    id: string
    company: string
    title: string
    profileHeadline: string
    employmentType: string
    isCurrent: boolean
    startDate: string
    endDate: string | null
    location: string
    locationType: string
    description: string
    whereFineThisJobs: string
    orderPosition: number
    createdAt: string
    updatedAt: string
}
