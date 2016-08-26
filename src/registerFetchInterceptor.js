export default (callback, win) => {
    if (!win.fetch) {
        throw new Error('fetch() isn\'t available, cannot register interceptor');
    }
    const originalFetch = win.fetch;
    win.fetch = function fetch() { // eslint-disable-line no-param-reassign
        callback(arguments);
        return originalFetch.apply(win, arguments);
    };
    return originalFetch;
};
