import { Request } from "express"
export interface userAuthInfoRequest extends Request {
    user?: {
        id?: string
    }
}