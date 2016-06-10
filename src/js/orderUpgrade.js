(function() {
"use strict";

// Store all pending callbacks, prevents promises to be called multiple times.
var callbacks = {};

// Next call to `order` will store its callbacks using this ID, then increment the ID.
var callbackId = 0;

///
/// ## <a name="order"></a>*store.orderUpgrade(oldProduct, newProduct)*
///
/// **Only available on Android with IAB API v5+**
///
/// You should check the property `store.canUpgradeSubscriptions` (will be true/false) to
/// see if this method is available.
///
/// Upgrade a subscription from `oldProduct` to `newProduct`. Play store billing automatically
/// manages the transitional billing and prorating.
///
/// The `newProduct` argument can be either:
///
///  - the `store.Product` object
///  - the product `id`
///  - the product `alias`
///
/// The `oldProduct` argument must be the string product ID.
///
/// See the ["Purchasing section"](#purchasing) to learn more about
/// the purchase process.
///
store.orderUpgrade = function(pid, pidNew) {

    var p = pidNew;

    if (typeof pidNew === "string") {
        p = store.products.byId[pidNew] || store.products.byAlias[pidNew];
        if (!p) {
            p = new store.Product({
                id: pid,
                loaded: true,
                valid: false
            });
        }
    }

    var localCallbackId = callbackId++;
    var localCallback = callbacks[localCallbackId] = {};

    function done() {
        delete localCallback.then;
        delete localCallback.error;
        delete callbacks[localCallbackId];
    }

    // Request the purchase.
    store.ready(function() {
        p.set("oldSku", pid);
        p.set("state", store.REQUESTED);
    });

    /// ### return value
    ///
    /// `store.orderUpgrade()` returns a Promise with the following methods:
    ///
    return {
        ///  - `then` - called when the order was successfully initiated
        then: function(cb) {
            localCallback.then = cb;
            store.once(p.id, "initiated", function() {
                if (!localCallback.then)
                    return;
                done();
                cb(p);
            });
            return this;
        },

        ///  - `error` - called if the order couldn't be initiated
        error: function(cb) {
            localCallback.error = cb;
            store.once(p.id, "error", function(err) {
                if (!localCallback.error)
                    return;
                done();
                cb(err);
            });
            return this;
        }
    };
    ///
};

///
/// As usual, you can unregister the callbacks by using [`store.off()`](#off).
///

// Remove pending callbacks registered with `order`
store.orderUpgrade.unregister = function(cb) {
    for (var i in callbacks) {
        if (callbacks[i].then === cb)
            delete callbacks[i].then;
        if (callbacks[i].error === cb)
            delete callbacks[i].error;
    }
};

})();
