import { UserModelType } from "./types";

declare global {
    declare namespace Express {
        export interface Request {
            context: {
                user: any
            }
        }
    }
}