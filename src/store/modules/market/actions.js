/* ============
 * Actions for the market module
 * ============
 *
 * The actions that are available on the
 * market module.
 */

import store from '@/store';
import Proxy from '@/proxies/MarketProxy';
import ProjectProxy from '@/proxies/ProjectProxy';
import UserProxy from '@/proxies/UserProxy';
import OrderProxy from '@/proxies/OrderProxy';
import * as types from './mutation-types';

/**
 * Inits main data for the trade sections
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 * @property {marketType} The market type (coin)
 * @property {currency} The currency (coin)
 */
export const init = async ({ commit, state }, { marketType, currency }) => {
  try {
    commit(types.LOADING, true);
    commit(types.ACTIVE_TYPE, null);
    commit(types.ACTIVE_CURRENCY, null);
    // load settings and currencies
    if (!state.ready) {
      // get market settings
      await store.dispatch('market/settings');
      // get currencies
      await store.dispatch('market/currencies');
      // get favorite pairs
      await store.dispatch('market/favoritePairs');
      // get default favorite pairs
      await store.dispatch('market/defaultFavoritePairs');
    }
    const market = `${currency}-${marketType}`;
    const response = await new Proxy().getTickers({ market });
    // set USD rate
    // commit(types.EXCHANGE_RATE, 0);
    store.dispatch('market/exchangeRate', { marketType, response, market });
    localStorage.setItem('lastMarket', `${currency}_${marketType}`);
    // set market type
    commit(types.ACTIVE_TYPE, marketType);
    // set currency
    commit(types.ACTIVE_CURRENCY, currency);
    // load market stats
    commit(types.INFO, response[market]);
    // load orders book + depth chart data
    store.dispatch('market/orderBook', { marketType, currency, actionType: 'sell', isInit: true });
    store.dispatch('market/orderBook', { marketType, currency, actionType: 'buy', isInit: true });
    // load trade history
    store.dispatch('market/history', { marketType, currency });
    // done
    commit(types.LOADING, false);
    commit(types.READY, true);
    return true;
  } catch (e) {
    // market not available
    return false;
  }
};

/**
 * Gets market settings
 *
 * @param {Object} context The store object
 */
export const settings = async ({ commit }) => {
  const response = await new Proxy().getSettings();
  commit(types.SETTINGS, response.result);

  const responseAll = await new Proxy().getSettings({ status: 'all' });
  commit(types.SETTINGS_ALL, responseAll.result);
};

/**
 * Gets all available currencies (coins)
 *
 * @param {Object} context The store object
 */
export const currencies = async ({ commit }) => {
  const response = await new Proxy().getCurrencies();
  // set as object (coin as key)
  commit(types.CURRENCIES, response.currencies);
  // set as array
  commit(types.CURRENCIES_ARR, response.currencies);
};

/**
 * Gets markets
 *
 * @param {Object} context The store object
 * @param {String} marketType The market type (coin)
 */
export const list = async ({ commit }, marketType) => {
  commit(types.LOADING_LIST, true);
  const response = await new Proxy().getTickers({ quoteCurrency: marketType.toUpperCase() });
  commit(types.LIST, {
    type: marketType,
    items: Object.values(response),
  });
  commit(types.LOADING_LIST, false);
};

/**
 * Gets favorite pairs
 *
 * @param {Object} context The store object
 */
export const favoritePairs = async ({ commit, rootState }) => {
  if (rootState.auth.authenticated) {
    commit(types.LOADING_FAVORITE_PAIRS, true);
    const response = await new UserProxy().getFavoritePairs();
    commit(types.FAVORITE_PAIRS, {
      favoritePairs: [...new Set([...response.result.favPairs])],
    });
    commit(types.LOADING_FAVORITE_PAIRS, false);
  }
  store.dispatch('market/favoritePairsSummaries');
};

/**
 * Gets default favorite pairs
 *
 * @param {Object} context The store object
 */
export const defaultFavoritePairs = async ({ commit }) => {
  commit(types.LOADING_DEFAULT_FAVORITE_PAIRS, true);
  const response = await new ProjectProxy().getSettings();
  commit(types.DEFAULT_FAVORITE_PAIRS, {
    defaultFavoritePairs: [...new Set([...response.result.project.defaultPairs])],
  });
  commit(types.LOADING_DEFAULT_FAVORITE_PAIRS, false);
  store.dispatch('market/favoritePairsSummaries');
};

/**
 * Gets favorite pairs
 *
 * @param {Object} context The store object
 * @param {String} pairs The currency pairs to load
 */
export const favoritePairsSummaries = async ({ commit, state }) => {
  if (state.loadingFavoritePairs) { return; }
  commit(types.LOADING_FAVORITE_PAIRS_SUMMARIES, true);
  const response = await new Proxy().getTickers({});
  commit(types.FAVORITE_PAIRS_SUMMARIES, { response });
  commit(types.LOADING_FAVORITE_PAIRS_SUMMARIES, false);
};

/**
 * Gets favorite pairs
 *
 * @param {Object} context The store object
 */
export const updateFavoritePairs = async ({ commit }, { favPairs }) => {
  commit(types.LOADING_FAVORITE_PAIRS, true);
  commit(types.FAVORITE_PAIRS, {
    favoritePairs: favPairs,
  });
  await new UserProxy().updateFavoritePairs({ favPairs });
  commit(types.LOADING_FAVORITE_PAIRS, false);
  store.dispatch('market/favoritePairsSummaries');
};

/**
 * Gets trading history
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 * @property {marketType} The market type (coin)
 * @property {currency} The currency (coin)
 */
export const history = async ({ commit }, { marketType, currency, isRefreshing }) => {
  if (!isRefreshing) {
    commit(types.LOADING_HISTORY, true);
    commit(types.TRADE_HISTORY, []);
  }
  // const status = '%5B"filled","partial"%5D';
  const params = {
    market: `${currency}-${marketType}`,
    // status,
    liquidity: 'T',
    limit: 50,
    page: 1,
  };
  const response = await new OrderProxy().listOrders(params);
  const { orders } = response.result;
  commit(types.TRADE_HISTORY, orders);
  if (!isRefreshing) {
    commit(types.LOADING_HISTORY, false);
  }
};

/**
 * Sets market dashboard state to not ready
 *
 * @param {Object} context The store object
 */
export const notReady = ({ commit }) => {
  commit(types.READY, false);
};

/**
 * Sets market info
 *
 * @param {Object} context The store object
 * @param {Object} info The market information
 */
export const setInfo = ({ commit }, info) => {
  commit(types.INFO, info);
};

/**
 * Adds item to the history array
 *
 * @param {Object} context The store object
 * @param {Object} item The history data item
 */
export const addHistory = ({ commit }, item) => {
  commit(types.TRADE_HISTORY_ADD, item);
};

/**
 * Refreshes History and Market summary
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 * @property {marketType} The market type (coin)
 * @property {currency} The currency (coin)
 */
export const refresh = async ({ commit, state }, { marketType, currency }) => {
  try {
    const market = `${currency}-${marketType}`;
    const response = await new Proxy().getTickers({ market });
    commit(types.INFO, response[market]);
    // load USD rate
    store.dispatch('market/exchangeRate', { marketType, market, response });
    // load trade history
    store.dispatch('market/history', { currency, marketType, isRefreshing: true });
    // load orders book + depth chart data
    store.dispatch('market/orderBook', { marketType, currency, actionType: 'sell', isInit: false });
    store.dispatch('market/orderBook', { marketType, currency, actionType: 'buy', isInit: false });

    store.dispatch('market/favoritePairsSummaries');
    // // done
    // commit(types.LOADING, false);
    // commit(types.READY, true);
    return true;
  } catch (e) {
    // market not available
    return false;
  }
};

/**
 * Gets order book data
 *
 * @param {Object} context The store object
 * @param {Object} id The user order ID
 * @property {marketType} The market type (coin)
 * @property {currency} The currency (coin)
 * @property {actionType} The action type (sell/buy)
 * @property {isInit} Is the first load
 */
export const orderBook = async ({ commit }, { marketType, currency, actionType, isInit }) => {
  const action = actionType === 'buy' ? 'bid' : 'ask';
  if (isInit) { // first load
    commit(types.LOADING_ARRAY, { action: `orderBook_${action}`, val: true });
    commit(types.LOADING_ARRAY, { action: 'orderBookChart', val: true });
    commit(types.ORDER_BOOK, {
      type: action,
      items: [],
    });
    commit(types.ORDER_BOOK_CHART, {
      type: action,
      items: [],
    });
  }
  try {
    const market = `${currency}-${marketType}`;
    const response = await new Proxy().listOrderBook(
      { market, side: actionType, limit: 50 },
    );
    commit(types.ORDER_BOOK, {
      type: action,
      items: actionType === 'buy' ? response.result.buy : response.result.sell,
    });
    commit(types.ORDER_BOOK_CHART, {
      type: action,
      items: actionType === 'buy' ? response.result.buy : response.result.sell,
    });
    commit(types.LOADING_ARRAY, { action: `orderBook_${action}`, val: false });
    commit(types.LOADING_ARRAY, { action: 'orderBookChart', val: false });
  } catch (e) {
    commit(types.ORDER_BOOK, {
      type: action,
      items: [],
    });
    commit(types.ORDER_BOOK_CHART, {
      type: action,
      items: [],
    });
    commit(types.LOADING_ARRAY, { action: `orderBook_${action}`, val: false });
    commit(types.LOADING_ARRAY, { action: 'orderBookChart', val: false });
  }
};

/**
 * Gets order book data
 *
 * @param {Object} context The store object
 * @param {Object} id The user order ID
 * @property {marketType} The market type (coin)
 * @property {currency} The currency (coin)
 * @property {actionType} The action type (sell/buy)
 */
// export const orderBookChart = async ({ commit }, { marketType, currency, actionType }) => {
//   const action = actionType === 'buy' ? 'bid' : 'ask';
//   commit(types.LOADING_ARRAY, { action: 'orderBookChart', val: true });
//   const market = `${currency}-${marketType}`;
//   const response = await new Proxy().listOrderBookChart({
//     market, actionType, limit: 50,
//   });
//   // need to add the markup to the prices like on the orderbook
//   commit(types.ORDER_BOOK_CHART, {
//     type: action,
//     items: response.data,
//   });
//   commit(types.LOADING_ARRAY, { action: 'orderBookChart', val: false });
// };

/**
 * Checks if USD coin price is needed and makes a request
 * @param {Object} store object
 * @param {Object} params action parameters
 * @property {String} marketType current market type
 * @property {String} currency current currency
 * @property {String} market current market (e.g. EOS-ETH)
 * @property {Orject} response tickers response
 */
export const exchangeRate = async ({ commit }, { marketType, response, market }) => {
  // Reset current value
  // commit(types.EXCHANGE_RATE, 0);
  if (marketType !== 'USDC') {
    // Make a request ONLY if a current market is not USDC
    const usdMarket = `${marketType}-USDC`;
    const usdResponse = await new Proxy().getTickers({ market: usdMarket });
    commit(types.EXCHANGE_RATE, Number(usdResponse[usdMarket].lastPrice));
  } else {
    // If market is USDC -- use existing response
    commit(types.EXCHANGE_RATE, Number(response[market].lastPrice));
  }
};

export const getMarkets = async ({ commit }, { market }) => {
  const response = await new Proxy().getSettings({ market });
  commit(types.MARKETS, response.result);
};

export default {
  init,
  settings,
  currencies,
  list,
  history,
  notReady,
  setInfo,
  addHistory,
  refresh,
  defaultFavoritePairs,
  favoritePairs,
  favoritePairsSummaries,
  updateFavoritePairs,
  orderBook,
  // orderBookChart,
  exchangeRate,
  getMarkets,
};
