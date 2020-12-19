import { describe, it } from 'mocha';
import { expect } from 'chai';
import { lightningApi } from '../lib/api';
import { store } from '../lib/store';

describe('test of API', () => {
    it('can get data of balance', async () => {
        const response = await lightningApi.get('me/getbalance');
        expect(response.data).not.to.equals(undefined);
    });
    it('can get data of board', async () => {
        const response = await lightningApi.get('board', false);
        expect(response.data).not.to.equals(undefined);
    });
});

describe('test of DB', () => {
    it('can get data from RDB', async () => {
        const response = await store.queryRDB('select count(*) from board_log');
        expect(response).not.to.equals(undefined);
    });
    after('end pool', () => {
        store.end();
    });
});