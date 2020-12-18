import { describe, it } from 'mocha';
import { expect } from 'chai';
import { lightningApi } from '../lib/api';

describe('test of API', () => {
    it('can get data of balance', async () => {
        const response = await lightningApi.get('me/getbalance');
        expect(response.data).not.to.equals(undefined);
    });
});