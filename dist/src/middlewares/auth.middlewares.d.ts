import { Request, Response, NextFunction } from 'express';
export declare const basicAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
