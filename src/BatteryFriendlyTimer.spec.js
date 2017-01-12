import assert from 'assert';
import sinon from 'sinon';

import BatteryFriendlyTimer from './BatteryFriendlyTimer';

describe('BatteryFriendlyTimer', () => {
    let clock;
    let timer;
    let win;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        // sinon fake timers also mock setInterval and setTimeout globally
        win = {
            fetch() {
                return new Promise(() => true);
            },
            setInterval: global.setInterval,
            setTimeout: global.setTimeout,
        };
        timer = new BatteryFriendlyTimer(win);
    });

    describe('setInterval', () => {
        let callback;
        const tryDelay = 2;
        const forceDelay = 5;

        beforeEach(() => {
            callback = sinon.stub();
            timer.setInterval(callback, tryDelay, forceDelay);
        });

        it('should not call callback function if fetch not called', () => {
            clock.tick(tryDelay);
            assert.ok(!callback.called);

            clock.tick(tryDelay);
            assert.ok(!callback.called);
        });

        it('should call callback function if fetch called after [tryDelay] ms', () => {
            win.fetch();
            assert.ok(!callback.called);

            clock.tick(tryDelay);
            win.fetch();
            assert.ok(callback.calledOnce);
        });

        it('should not call callback function if it has been called less than [tryDelay] ms ago', () => {
            clock.tick(tryDelay);
            win.fetch();
            assert.ok(callback.calledOnce);

            clock.tick(tryDelay - 1);
            win.fetch();
            assert.ok(callback.calledOnce);
        });

        it('should call callback after [forceDelay] ms even if fetch hasn\'t been called', () => {
            clock.tick(forceDelay);
            assert.ok(callback.calledOnce);
        });
    });

    afterEach(() => {
        clock.restore();
    });
});
