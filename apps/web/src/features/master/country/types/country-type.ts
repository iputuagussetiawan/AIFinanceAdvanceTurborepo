export interface ICountry {
    id: string
    name: string
    code: string
    dialCode?: string
    flag?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface ICountriesResponse {
    message: string
    data: ICountry[]
}

export interface ICountryResponse {
    message: string
    data: ICountry
}
