export interface ICity {
    id: string
    name: string
    state: string
    country: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface ICitiesResponse {
    message: string
    data: ICity[]
}

export interface ICityResponse {
    message: string
    data: ICity
}
