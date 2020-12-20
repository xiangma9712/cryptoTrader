import { store } from './lib/store';
import { lightningApi } from './lib/api';
import Watcher from './lib/watcher';

const main = () => {
    const watcher = new Watcher(lightningApi, store);
    setInterval(() => watcher.recordBoard(), 1000 * 10);
}

main();