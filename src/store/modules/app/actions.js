/* ============
 * Actions for the app module
 * ============
 *
 * The actions that are available on the
 * app module.
 */
import ProjectProxy from '@/proxies/ProjectProxy';
import store from '@/store';
import * as types from './mutation-types';

/**
 * Inits main data for the app
 *
 * @param {Object} context The store object
 */
export const init = async ({ commit }) => {
  const auth = store.getters['auth/authenticated'];
  if (auth) {
    // get user info
    await store.dispatch('account/getUser');
  }

  const userThemeMode = JSON.parse(localStorage.getItem('themeMode'));
  if (typeof userThemeMode === 'boolean') {
    await store.dispatch('app/setThemeMode', userThemeMode);
  }
  const response = await new ProjectProxy().getSettings();
  await store.dispatch('app/setAppSetting', response.result.project);

  // app is ready
  commit(types.READY, true);
};

/**
 * Sets bottom navigation bar menu item name
 *
 * @param {Object} context The store object
 * @param {String} value The menu item name
 */
export const setBottomNav = ({ commit }, value) => {
  commit(types.BOTTOM_NAV, value);
};

/**
 * Sets visible chart type (price / marker depth)
 *
 * @param {Object} The store object
 * @param {String} value The chart type
 */
export const setChartType = ({ commit }, value) => {
  commit(types.CHART_TYPE, value);
};

/**
 * Sets the price for the trading form
 *
 * @param {Object} context The store object
 * @param {Float} value The price
 */
export const setTradePrice = ({ commit }, value) => {
  commit(types.TRADE_PRICE, value);
};
/**
 * Sets the action intent for the trading form
 *
 * @param {Object} context The store object
 * @param {Object} value Payload containing order type,
 *                       trade action ('buy' or 'sell'), price, and amount
 */
export const setTradeActionIntent = ({ commit }, value) => {
  commit(types.TRADE_ACTION_INTENT, value);
};

/**
 * Checks trading form visibility state.
 *
 * @param {Object} context The store object
 */
export const checkTradeFormVisibility = ({ commit }) => {
  const value = localStorage.getItem('isFormVisible');
  if (value !== null) {
    commit(types.TRADE_FORM_VISIBLE, JSON.parse(value));
  }
};

/**
 * Sets trading form visibility state.
 *
 * @param {Object} context The store object
 * @param {Boolean} value The state
 */
export const setTradeFormVisibility = ({ commit }, value) => {
  localStorage.setItem('isFormVisible', value);
  commit(types.TRADE_FORM_VISIBLE, value);
};

/**
 * Checks user orders section visibility state.
 *
 * @param {Object} context The store object
 */
export const checkUserOrdersVisibility = ({ commit }) => {
  const value = localStorage.getItem('isUserOrdersVisible');
  if (value !== null) {
    commit(types.TRADE_USER_ORDERS_VISIBLE, JSON.parse(value));
  } else {
    commit(types.TRADE_USER_ORDERS_VISIBLE, true);
  }
};

/**
 * Sets user orders section visibility state.
 *
 * @param {Object} context The store object
 * @param {Boolean} value The state
 */
export const setUserOrdersVisibility = ({ commit }, value) => {
  localStorage.setItem('isUserOrdersVisible', value);
  commit(types.TRADE_USER_ORDERS_VISIBLE, value);
};

/**
 * Checks price chart expanded state state.
 *
 * @param {Object} context The store object
 */
export const checkPriceChartExpanded = ({ commit }) => {
  const value = localStorage.getItem('isPriceChartExpanded');
  if (value !== null) {
    commit(types.TRADE_PRICE_CHART_EXPANDED, JSON.parse(value));
  } else {
    commit(types.TRADE_PRICE_CHART_EXPANDED, false);
  }
};

/**
 * Sets price chart expanded state.
 *
 * @param {Object} context The store object
 * @param {Boolean} value The state
 */
export const setPriceChartExpanded = ({ commit }, value) => {
  localStorage.setItem('isPriceChartExpanded', value);
  commit(types.TRADE_PRICE_CHART_EXPANDED, value);
};

/**
 * Sets last price status (up / down / did not changed)
 *
 * @param {Object} context The store object
 * @param {String} value The status (up, down, null)
 */
export const setTradePriceStatus = ({ commit, state }, value) => {
  commit(types.TRADE_PRICE_STATUS, value);
  if (state.tradePriceStatusTm !== null) {
    clearTimeout(state.tradePriceStatusTm);
  }
  // restore to null after 10s
  const tm = setTimeout(() => {
    store.dispatch('app/resetTradePriceStatus');
  }, 10000);
  commit(types.TRADE_PRICE_STATUS_TM, tm);
};

/**
 * Reset last price status (set to null)
 *
 * @param {Object} context The store object
 */
export const resetTradePriceStatus = ({ commit }) => {
  commit(types.TRADE_PRICE_STATUS, null);
  commit(types.TRADE_PRICE_STATUS_TM, null);
};

/**
 * Adds callback for the history socket event
 * Used to get detailed data for user socket events
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 * @property {id} The order ID
 * @property {cb} The callback
 */
export const addTradeHistoryCb = ({ commit }, { id, cb }) => {
  commit(types.TRADE_HISTORY_CALLBACK, { id, cb });
};


/**
 * Invert theme colors.
 *
 * @param {Object} context The store object
 */
export const toggleThemeMode = ({ commit }) => {
  commit(types.THEME_MODE_SWITCH, null);
};

/**
 * Set theme mode (dark/light).
 *
 * @param {Object} context The store object
 * @param {Boolean} value
 */
export const setThemeMode = ({ commit }, value) => {
  if (value) {
    commit(types.THEME_MODE_SWITCH_DARK, null);
  } else {
    commit(types.THEME_MODE_SWITCH_LIGHT, null);
  }
};

/**
 * Mark a Vue component as busy.
 * @param commit
 * @param value
 */
export const addBusyComponent = ({ commit }, value) => {
  commit(types.THEME_ADD_BUSY_COMPONENT, value);
};
/**
 * @param commit
 * @param value
 */
export const removeBusyComponent = ({ commit }, value) => {
  commit(types.THEME_REMOVE_BUSY_COMPONENT, value);
};

export const setAppSetting = async ({ commit }, value) => {
  commit(types.SET_APP_SETTING, value);
};

export default {
  init,
  setBottomNav,
  setChartType,
  setTradePrice,
  setTradeActionIntent,
  checkTradeFormVisibility,
  setTradeFormVisibility,
  checkUserOrdersVisibility,
  setUserOrdersVisibility,
  checkPriceChartExpanded,
  setPriceChartExpanded,
  setTradePriceStatus,
  resetTradePriceStatus,
  addTradeHistoryCb,
  toggleThemeMode,
  setThemeMode,
  addBusyComponent,
  removeBusyComponent,
  setAppSetting,
};
