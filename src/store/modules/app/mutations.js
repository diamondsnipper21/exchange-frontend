/* ============
 * Mutations for the app module
 * ============
 *
 * The mutations that are available on the
 * app module.
 */

import {
  BOTTOM_NAV,
  CHART_TYPE,
  TRADE_PRICE,
  TRADE_PRICE_STATUS,
  TRADE_PRICE_STATUS_TM,
  TRADE_FORM_VISIBLE,
  TRADE_USER_ORDERS_VISIBLE,
  TRADE_PRICE_CHART_EXPANDED,
  TRADE_HISTORY_CALLBACK,
  THEME_MODE_SWITCH,
  THEME_MODE_SWITCH_LIGHT,
  THEME_MODE_SWITCH_DARK,
  READY,
  THEME_ADD_BUSY_COMPONENT,
  THEME_REMOVE_BUSY_COMPONENT, TRADE_ACTION_INTENT,
  SET_APP_SETTING,
} from './mutation-types';

export default {
  [BOTTOM_NAV](state, value) {
    state.bottomNav = value;
  },

  [CHART_TYPE](state, value) {
    state.chartType = value;
  },

  [TRADE_PRICE](state, value) {
    state.tradePrice = value;
  },

  [TRADE_ACTION_INTENT](state, value) {
    state.tradeActionIntent = value;
  },

  [TRADE_PRICE_STATUS](state, value) {
    state.tradePriceStatus = value;
  },

  [TRADE_PRICE_STATUS_TM](state, value) {
    state.tradePriceStatusTm = value;
  },

  [TRADE_FORM_VISIBLE](state, value) {
    state.tradeFormVisible = value;
  },

  [TRADE_USER_ORDERS_VISIBLE](state, value) {
    state.tradeUserOrdersVisible = value;
  },

  [TRADE_PRICE_CHART_EXPANDED](state, value) {
    state.tradePriceChartExpanded = value;
  },

  [TRADE_HISTORY_CALLBACK](state, { id, cb }) {
    state.tradeHistoryCallback[id] = cb;
  },

  [THEME_MODE_SWITCH](state) {
    const newValue = !state.themeMode;
    state.themeMode = newValue;
    localStorage.setItem('themeMode', JSON.stringify(newValue));
  },

  [THEME_MODE_SWITCH_DARK](state) {
    state.themeMode = true;
    localStorage.setItem('themeMode', 'true');
  },

  [THEME_MODE_SWITCH_LIGHT](state) {
    state.themeMode = false;
    localStorage.setItem('themeMode', 'false');
  },

  [THEME_ADD_BUSY_COMPONENT](state, value) {
    state.busyComponents.push(value);
  },

  [THEME_REMOVE_BUSY_COMPONENT](state, value) {
    state.busyComponents = state.busyComponents.filter(componentName => componentName !== value);
  },

  [READY](state, value) {
    state.ready = value;
  },

  [SET_APP_SETTING](state, value) {
    state.setting = value;
    localStorage.setItem('themeSetting', JSON.stringify(value));
  },
};
