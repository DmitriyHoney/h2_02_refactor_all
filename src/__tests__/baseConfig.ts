import { settings } from '../config/settings';
import { connectDB } from '../config/dataBase';
import { Server } from 'http';
import request from 'supertest';
import app from '../app';

export const configForTests = {
    urls: {
        users: '/api/users/',
        deleteAll: '/api/testing/all-data/',
    },
    basicToken: 'Basic YWRtaW46cXdlcnR5',
    incorrectBasicToken: 'Basic YWRtaW46cXdlcnT6',
    server: null as Server | null,
    app: app as any,
    startTestServer() {
        this.server = app.listen(settings.PORT_TEST, async () => {
            await connectDB(settings.DB_NAME_TEST);
        });
    },
    reqWithAuthHeader(method: string, url: string, token: string) {
        // TODO: remove //@ts-ignore
        // @ts-ignore
        return request(app)[method](url).set('Authorization', token);
    }
}