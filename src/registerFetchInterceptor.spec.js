import assert from 'assert';
import registerFetchInterceptor from './registerFetchInterceptor';

describe('registerFetchInterceptor', () => {
    it('should decorate fetch() to trigger the supplied callback', () => {
        const win = {
            fetch() {
                return new Promise(() => true);
            },
        };
        let called = false;
        registerFetchInterceptor(() => { called = true; }, win);
        win.fetch();
        assert.ok(called);
    });
});
