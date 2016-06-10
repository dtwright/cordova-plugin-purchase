/*
 * checks for ability to upgrade subscriptions and sets status variable appropriately
 */
/*global cordova */

"use strict";

store.ready(function() {
    cordova.exec(function(result) {
        store.canUpgradeSubscriptions = (result === 1);// convert to bool
    }, function() {
        console.log('failed to figure out if I can upgrade subs...');
    }, "InAppBillingPlugin", "canUpgradeSubs", []);
});
