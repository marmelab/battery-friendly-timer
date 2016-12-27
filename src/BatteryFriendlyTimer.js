import registerFetchInterceptor from './registerFetchInterceptor';

class BatteryFriendlyTimer {
    constructor(win) {
        this.win = win;
        this.isFetching = false;
        this.latestId = 0;
        this.timeouts = {};
        this.forceTimeouts = {};
        this.intervals = {};
        this.forceIntervals = {};
        registerFetchInterceptor(this.fetchHappens.bind(this), this.win);
    }

    fetchHappens() {
        if (this.isFetching) {
            return;
        }
        this.isFetching = true;
        const now = Date.now();
        Object.keys(this.timeouts).forEach(timeoutKey => {
            const timeout = this.timeouts[timeoutKey];
            if (now - timeout.from >= timeout.tryDelay) {
                timeout.callback();
                this.clearTimeout(timeoutKey);
            }
        });
        Object.keys(this.intervals).forEach(intervalKey => {
            const interval = this.intervals[intervalKey];
            if ((now - interval.latest) >= interval.tryDelay) {
                interval.callback();
                interval.latest = now - ((now - interval.from) % interval.tryDelay);
            }
        });
        this.isFetching = false;
    }

    setTimeout(callback, tryDelay, forceDelay) {
        const latestId = ++this.latestId;
        this.timeouts[latestId] = { from: Date.now(), callback, tryDelay };
        this.forceTimeouts[latestId] = this.win.setTimeout(callback, forceDelay);
        return latestId;
    }

    clearTimeout(id) {
        this.win.clearTimeout(this.forceTimeouts[id]);
        delete this.timeouts[id];
        delete this.forceTimeouts[id];
    }

    setInterval(callback, tryDelay, forceDelay) {
        const latestId = ++this.latestId;
        const now = Date.now();
        const interval = { from: now, latest: now, callback, tryDelay, forceDelay };
        this.intervals[latestId] = interval;
        this.forceIntervals[latestId] = this.win.setInterval(() => {
            if ((now - interval.latest) >= interval.forceDelay) {
                callback();
                interval.latest = now;
            }
        }, forceDelay);
        return latestId;
    }

    clearInterval(id) {
        this.win.clearInterval(this.forceIntervals[id]);
        delete this.intervals[id];
        delete this.forceIntervals[id];
    }
}

export default BatteryFriendlyTimer;
