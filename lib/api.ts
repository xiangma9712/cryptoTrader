require('dotenv').config();
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;

class LightningApi {
    key: string;
    secret: string;
    api: AxiosInstance;

    constructor(key?: string, secret?: string) {
        if (key == undefined || secret == undefined) {
            throw new Error('missing credentials');
        }
        this.secret = secret || '';
        this.key = key || '';

        this.api = axios.create({
            baseURL: "https://api.bitflyer.com/v1/"
        });
        console.info(`axios initalization done`);
    }

    private buildHeader(method: string, path: string, params?: object) {
        const timestamp = Date.now().toString();
        const signature = this.sign(timestamp, method.toUpperCase(), `/v1/${path}`, params);
        return {
            'ACCESS-KEY': this.key,
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-SIGN': signature,
            'Content-Type': 'application/json'
        }
    }

    private sign(timestamp: string, method: string, path: string, params?: object): string {
        let data = timestamp + method + path;
        if (params != undefined) {
            data += JSON.stringify(params);
        }
        return crypto.createHmac('sha256', this.secret).update(data).digest('hex');
    }

    get defaultHeader () {
        return {
            'Content-Type': 'application/json'
        }
    }

    public async post(path: string, params: object, isAuthRequired: boolean = true) {
        const headers = isAuthRequired ? this.buildHeader('post', path, params) : this.defaultHeader;
        return await this.api.post(path, params, { headers });
    }

    public async get(path: string, isAuthRequired: boolean = true) {
        const headers = isAuthRequired ? this.buildHeader('get', path) : this.defaultHeader;
        return await this.api.get(path, { headers });
    }
}

export const lightningApi = new LightningApi(key, secret);