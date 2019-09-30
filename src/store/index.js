/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from 'vue';
import Vuex from 'vuex';
// import createLogger from 'vuex/dist/logger';

// Modules
import app from './modules/app';
import admin from './modules/admin';
import account from './modules/account';
import auth from './modules/auth';
import market from './modules/market';
import order from './modules/order';
import wallet from './modules/wallet';
import orderBook from './modules/orderbook/orderbook';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  /**
   * Assign the modules to the store.
   */
  modules: {
    app,
    admin,
    account,
    auth,
    market,
    order,
    wallet,
    orderBook,
  },

  /**
   * If strict mode should be enabled.
   */
  strict: debug,

  /**
   * Plugins used in the store.
   */
//  plugins: debug ? [createLogger()] : [],
});
