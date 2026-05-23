export interface IState {
    id: string
    name: string
    code: string
    country: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface IStatesResponse {
    message: string
    data: IState[]
}

export interface IStateResponse {
    message: string
    data: IState
}
