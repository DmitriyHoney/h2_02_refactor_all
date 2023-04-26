import { settings } from './settings';
import mongoose from 'mongoose';

export const connectDB = async (dbName: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(`${settings.DB_URL}/${dbName}`);
            console.log(`Connected successfully - ${settings.DB_URL}/${dbName}`)
            resolve(true);
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });

}