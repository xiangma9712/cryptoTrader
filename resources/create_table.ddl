create table board_log (
    `timestamp` timestamp NOT NULL PRIMARY KEY,
    `mid_price` bigint NOT NULL,
    `lowest_ask` bigint NOT NULL,
    `highest_bid` bigint NOT NULL,
    `ask_liquidity` decimal(18,10),
    `bid_liquidity` decimal(18,10)
);
