import request from 'supertest';

import { HTTP_STATUSES } from '../config/baseTypes';
import { configForTests } from './baseConfig';
import app from "../app";
import { UserPostT } from "../models/users.models";

const users: Array<UserPostT> = [];
const countUsers = 21;
const pagination = {
    pageSize: 5,
    pageNumber: 1,
} as { pageSize: number | string, pageNumber: number | string };

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

    test('create users and check base properties pagination', async () => {
        const promises = users.map((uBody) => {
            return configForTests.reqWithAuthHeader('post', configForTests.urls.users, configForTests.basicToken)
                .send(uBody)
        });
        await Promise.all(promises);

        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(10);
        expect(result.body).toEqual({
            pagesCount: 3,
            page: 1,
            pageSize: 10,
            totalCount: countUsers,
            items: expect.any(Array),
        });
    });

    test('check pageSize and pageNumber job', async () => {
        const query = `?pageSize=${pagination.pageSize}&pageNumber=${pagination.pageNumber}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(pagination.pageSize);
        expect(result.body).toEqual({
            pagesCount: Math.abs(Math.ceil(countUsers / +pagination.pageSize)),
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: countUsers,
            items: expect.any(Array),
        });
    });

    test('check last pageNumber items count', async () => {
        pagination.pageNumber = 5;
        const query = `?pageSize=${pagination.pageSize}&pageNumber=${pagination.pageNumber}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(1);
        expect(result.body).toEqual({
            pagesCount: Math.abs(Math.ceil(countUsers / +pagination.pageSize)),
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: countUsers,
            items: expect.any(Array),
        });
    });

    test('check not exist page - should return empty items', async () => {
        pagination.pageNumber = 6;
        const query = `?pageSize=${pagination.pageSize}&pageNumber=${pagination.pageNumber}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(0);
        expect(result.body).toEqual({
            pagesCount: Math.ceil(countUsers / +pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: countUsers,
            items: expect.any(Array),
        });
    });

    test('check negative page', async () => {
        pagination.pageNumber = '-1';
        const query = `?pageSize=${pagination.pageSize}&pageNumber=${pagination.pageNumber}`;
        const result = await configForTests.reqWithAuthHeader('get', configForTests.urls.users + query, configForTests.basicToken)
            .expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(5);
        expect(result.body).toEqual({
            pagesCount: Math.abs(Math.ceil(countUsers / +pagination.pageSize)),
            page: Math.abs(+pagination.pageNumber),
            pageSize: pagination.pageSize,
            totalCount: countUsers,
            items: expect.any(Array),
        });
    });
});