export interface IPaginationMeta {
    totalData: number
    totalPage: number
    currentPage: number
    limit: number
}

export interface IApiResponse<T> {
    success: boolean
    message: string
    data: T
    meta?: IPaginationMeta // Opsional karena tidak semua API memiliki pagination
}
