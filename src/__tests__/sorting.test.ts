import request from 'supertest';

import { HTTP_STATUSES } from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import { UserPostT } from "../models/users.models";

const users: Array<UserPostT> = [];
const countUsers = 21;
const sort = {
    sortBy: 'login',
    sortDirection: 'asc',
} as { sortBy: string, sortDirection: string };

for (let i = 1; i <= countUsers; i++) {
    users.push({
        login: `testUser${i}`,
        password: '12345678',
        email: `test${i}@ya.ru`,
    })
}

// test on users collections
describe('base pagination', () => {
    beforeAll(async () => {
        configForTests.startTestServer();
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
    });

    afterAll(async () => {
        await request(app)
            .delete(configForTests.urls.deleteAll)
            .expect(HTTP_STATUSES.NO_CONTENT_204, {});
        configForTests.server?.close()
    });

    test('create users', async () => {
        const promises = users.map((uBody) => {
            return configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(uBody)
        });
        await Promise.all(promises);
    });
    test('check sort by login asc', async () => {
        const query = `?sortBy=${sort.sortBy}&sortDirection=${sort.sortDirection}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(10);
        expect(result.body.items[0].login).toBe(users[0].login);
    });
    test('check sort by login desc', async () => {
        sort.sortDirection = 'desc';
        const query = `?sortBy=${sort.sortBy}&sortDirection=${sort.sortDirection}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(10);
        expect(result.body.items[0].login).toBe('testUser9');
    });
});