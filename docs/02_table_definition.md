# テーブル定義

## Board Log
板の情報を保存するテーブル

|物理名|論理名|データ型|補足|
|---|---|---|---|
|timestamp|日時|TIMESTAMP|板情報取得を行った時間|
|mid_price|価格|BIGINT||
|lowest_ask|最低売り呼値|BIGINT||
|highest_bit|最高買い呼値|BIGINT||
|ask_liquidity|売り数量|DECIMAL(18,10)|mid * 1.05までの価格で提示されているaskの総量|
|bit_liquidity|売り数量|DECIMAL(18,10)|mid * 0.95までの価格で提示されているbitの総量|