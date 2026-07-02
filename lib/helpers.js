var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export function loadScript(callback, scriptSrc, err) {
    if (scriptSrc === void 0) { scriptSrc = 'https://mc.yandex.ru/metrika/tag.js'; }
    var head = document.head || document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = scriptSrc;
    head.appendChild(script);
    script.onload = callback;
    if (err)
        script.onerror = err;
}
function createMockMetrika(v, config) {
    console.warn('[vue-yandex-metrika] Tracking is disabled, because env option is not "production"');
    if (config.debug) {
        console.warn('[vue-yandex-metrika] DEBUG is true: you\'ll see all API calls in the console');
    }
    var log = function (method) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (config.debug) {
            console.log.apply(console, __spreadArrays(["[vue-yandex-metrika] " + method + ":"], args));
        }
    }; };
    return v.prototype.$metrika = v.$metrika = {
        addFileExtension: log('addFileExtension'),
        extLink: log('extLink'),
        file: log('file'),
        getClientID: log('getClientID'),
        hit: log('hit'),
        notBounce: log('notBounce'),
        params: log('params'),
        reachGoal: log('reachGoal'),
        replacePhones: log('replacePhones'),
        setUserID: log('setUserID'),
        userParams: log('userParams'),
    };
}
export function createMetrika(v, config) {
    if (config.env === 'production') {
        var init = __assign({ id: config.id }, config.options);
        var metrika = new window.Ya.Metrika2(init);
        if (!window.yaCounters)
            window.yaCounters = {};
        window.yaCounters["" + config.id] = metrika;
        return v.prototype.$metrika = v.$metrika = metrika;
    }
    return createMockMetrika(v, config);
}
export function startTracking(metrika, config) {
    if (config.router) {
        config.router.afterEach(function (to, from) {
            if (config.ignoreRoutes && to.name && config.ignoreRoutes.indexOf(to.name) > -1) {
                return;
            }
            if (config.skipSamePath && to.path == from.path) {
                return;
            }
            metrika.hit(to.path, { referer: from.path });
        });
    }
}
