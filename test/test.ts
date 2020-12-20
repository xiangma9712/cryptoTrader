import { describe, it } from 'mocha';
import { expect } from 'chai';
import { lightningApi } from '../lib/api';
import { store } from '../lib/store';
import Watcher from '../lib/watcher';

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
    after('end pool', async () => {
        await store.end();
    });
});

describe('test of watcher', () => {
    before('restore pool', () => {
        store.restart();
    });
    it('can record board data', async () => {
        const beforeCount = await store.queryRDB('select count(*) from board_log');
        const watcher = new Watcher(lightningApi, store);
        await watcher.recordBoard();
        const afterCount = await store.queryRDB('select count(*) from board_log');
        expect(afterCount[0]['count(*)']).to.equals(beforeCount[0]['count(*)'] + 1);
    });
    after('end pool', async () => {
        await store.end();
    });
});