// #include "copyright.js"
// #include "store.js"
// #include "platforms/plugin-bridge.js"
// #include "platforms/plugin-adapter.js"
// #include "platforms/android-productdata.js"
// #include "platforms/android-canupgrade.js"

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
    store.android = store.inappbilling;
}

module.exports = store;
//! make sure this variable exists and is set to something safe
store.canUpgradeSubscriptions = false;
