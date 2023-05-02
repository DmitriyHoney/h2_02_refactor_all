import jwt from 'jsonwebtoken';
import { settings } from '../config/settings';

export const jwtService = {
    createJWT(payload: object, expiresIn: string) {
        return jwt.sign(payload, settings.JWT_SECRET, { expiresIn });
    },
    verifyToken(token: string) {
        try {
            return jwt.verify(token, settings.JWT_SECRET);
        } catch (e) {
            return null;
        }
    },
};
