import mariadb, { PoolConnection } from 'mariadb';
import { dbconfig } from './dbconfig'; 
const env = process.env.ENV || 'dev';

class Store {
    private sqlPool = mariadb.createPool(dbconfig[env].sql);

    public async queryRDB(query: string) {
        let conn = await this.sqlPool.getConnection();
        let res: any;
        let error: any;
        try {
            res = await conn.query(query);
        } catch (err) {
            error = err;
        } finally {
            conn.release();
        }
        if (error != undefined) throw error;
        return res;
    }

    public async batchQueryRDB(queries: Array<string>) {
        let conn: PoolConnection;
        let res: any;
        let error: any;
        conn = await this.sqlPool.getConnection();
        try {
            conn.beginTransaction();
            for (const query of queries) {
                res = await conn.query(query);
            }
            conn.commit();
        } catch (err) {
            conn.rollback();
            error = err;
        } finally {
            conn.release();
        }
        if (error != undefined) throw error;
        return res;
    }

    public async end() {
        await this.sqlPool.end();
    } 
}

export const store = new Store();