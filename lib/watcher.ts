import { LightningApi } from './api';
import { Store } from './store';
const LIQUIDITY_WIDTH = 1;

export default class Watcher {
    private api: LightningApi;
    private store: Store;
    constructor (api: LightningApi, store: Store) {
        this.api = api;
        this.store = store;
    }

    public async recordBoard() {
        const response = await this.api.get('board', false);
        const board = response.data;
        const builder = BoardQueryBuilder.init()
            .setMidPrice(board.mid_price)
            .setHighestBid(board.bids[0].price)
            .setLowestAsk(board.asks[0].price);
        let bidLiquidity: number = 0;
        let askLiquidity: number = 0;
        const lowBar = board.mid_price * (1 - LIQUIDITY_WIDTH / 100);
        const highBar = board.mid_price * (1 + LIQUIDITY_WIDTH / 100);
        for (const bid of board.bids) {
            if (bid.price < lowBar) break;
            bidLiquidity += bid.size;
        }
        for (const ask of board.asks) {
            if (ask.price > highBar) break;
            askLiquidity += ask.size;
        }
        const query = builder.setAskLiquidity(askLiquidity)
            .setBidLiquidity(bidLiquidity)
            .build();
        await this.store.queryRDB(query);
        console.info('data recorded');
    }
}

class BoardQueryBuilder {
    private midPrice?: number;
    private lowestAsk?: number;
    private highestBid?: number;
    private askLiquidity?: number;
    private bidLiquidity?: number;

    public build(): string {
        return `insert into board_log value(
            now(),
            ${this.midPrice},
            ${this.lowestAsk},
            ${this.highestBid},
            ${this.askLiquidity},
            ${this.bidLiquidity}
        )`
    }

    private constructor () {}

    public static init(): BoardQueryBuilder {
        return new BoardQueryBuilder();
    }

    public setMidPrice(midPrice: number) {
        this.midPrice = midPrice;
        return this;
    }

    public setHighestBid(highestBid: number) {
        this.highestBid = highestBid;
        return this;
    }

    public setLowestAsk(lowestAsk: number) {
        this.lowestAsk = lowestAsk;
        return this;
    }

    public setAskLiquidity(askLiquidity: number) {
        this.askLiquidity = askLiquidity;
        return this;
    }

    public setBidLiquidity(bidLiquidity: number) {
        this.bidLiquidity = bidLiquidity;
        return this;
    }
}