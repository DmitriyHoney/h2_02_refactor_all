import request from 'supertest';

import { HTTP_STATUSES } from "../config/baseTypes";
import { configForTests } from "./baseConfig";
import app from "../app";

describe('middlewares', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
    });

    afterAll(() => configForTests.server?.close());

    describe('check BasicAuth middleware', () => {
        test('should return 401 - empty headers authorizations', async () => {
            await request(app)
                .get(configForTests.urls.users)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401, {});
        });

        test('should return 401 - incorrect basic authorizations', async () => {
            await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.incorrectBasicToken)
                .expect(HTTP_STATUSES.NOT_AUTHORIZED_401);
        });

        test('should return 200 - basic authorizations correct', async () => {
            await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
                .expect(HTTP_STATUSES.OK_200);
        });
    });

    // TODO: write test for check count request middleware
});