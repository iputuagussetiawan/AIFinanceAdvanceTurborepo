import { UserDocument } from '../modules/user/user.model'

declare global {
    namespace Express {
        interface User extends UserDocument {
            _id?: any
        }
        interface Request {
            jwt?: string
            sessionId?: string
        }
    }
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
