/* ============
 * Mutations for the market module
 * ============
 *
 * The mutations that are available on the
 * market module.
 */

import Vue from 'vue';

import convertToNumbers from '@/utils/convertToNumbers';
import calculateChartTotals from '@/utils/calculateChartTotals';
import compare from '@/utils/compare';
import {
  TYPES,
  ACTIVE_TYPE,
  ACTIVE_CURRENCY,
  LIST,
  DEFAULT_FAVORITE_PAIRS,
  FAVORITE_PAIRS,
  FAVORITE_PAIRS_SUMMARIES,
  INFO,
  TRADE_HISTORY,
  SETTINGS,
  CURRENCIES,
  CURRENCIES_ARR,
  LOADING,
  LOADING_ARRAY,
  LOADING_LIST,
  LOADING_DEFAULT_FAVORITE_PAIRS,
  LOADING_FAVORITE_PAIRS,
  LOADING_FAVORITE_PAIRS_SUMMARIES,
  LOADING_HISTORY,
  TRADE_HISTORY_ADD,
  READY,
  EXCHANGE_RATE,
  MARKETS,
  ORDER_BOOK,
  ORDER_BOOK_CHART,
  SETTINGS_ALL,
} from './mutation-types';

export default {
  [TYPES](state, types) {
    state.types = types;
  },

  [ACTIVE_TYPE](state, type) {
    state.activeType = type;
  },

  [ACTIVE_CURRENCY](state, currency) {
    state.activeCurrency = currency;
  },

  [LIST](state, { type, items }) {
    Vue.set(state.list, type, items);
  },

  [DEFAULT_FAVORITE_PAIRS](state, { defaultFavoritePairs }) {
    state.defaultFavoritePairs = defaultFavoritePairs;
  },

  [FAVORITE_PAIRS](state, { favoritePairs }) {
    state.favoritePairs = favoritePairs;
  },

  [FAVORITE_PAIRS_SUMMARIES](state, { response }) {
    const { favoritePairs, defaultFavoritePairs } = state;
    let favoritePairsSummaries;
    if (!favoritePairs || favoritePairs.length === 0) {
      // Use default pairs
      favoritePairsSummaries = defaultFavoritePairs.map(pair => convertToNumbers(response[pair]));
    } else {
      // Use favorite pairs
      favoritePairsSummaries = favoritePairs.map(pair => convertToNumbers(response[pair]));
    }
    state.favoritePairsSummaries = favoritePairsSummaries;
  },

  [INFO](state, info) {
    state.info = convertToNumbers(info);
  },

  [TRADE_HISTORY](state, history) {
    state.tradeHistory = history;
  },

  [TRADE_HISTORY_ADD](state, item) {
    item.new = true;
    state.tradeHistory.unshift(item);
  },

  [SETTINGS](state, settings) {
    state.settings = settings;
  },

  [SETTINGS_ALL](state, settings) {
    state.settings_all = settings;
  },


  [CURRENCIES](state, currencies) {
    state.currencies = {};
    // set coin abbr as key
    currencies.forEach((item) => {
      Vue.set(state.currencies, item.currency, item);
    });
  },

  [CURRENCIES_ARR](state, currencies) {
    state.currenciesArr = currencies;
  },

  [LOADING](state, val) {
    state.loading = val;
  },

  [LOADING_ARRAY](state, { action, val }) {
    state.loadingArray[action] = val;
  },

  [LOADING_LIST](state, val) {
    state.loadingList = val;
  },

  [LOADING_DEFAULT_FAVORITE_PAIRS](state, val) {
    state.loadingDefaultFavoritePairs = val;
  },

  [LOADING_FAVORITE_PAIRS](state, val) {
    state.loadingFavoritePairs = val;
  },

  [LOADING_FAVORITE_PAIRS_SUMMARIES](state, val) {
    state.loadingFavoritePairs = val;
  },

  [LOADING_HISTORY](state, val) {
    state.loadingHistory = val;
  },

  [READY](state, val) {
    state.ready = val;
  },

  [EXCHANGE_RATE](state, val) {
    state.exchangeRate = val;
  },

  [MARKETS](state, val) {
    state.markets = val;
  },

  [ORDER_BOOK](state, { type, items }) {
    // item model: [unitPrice, amount, rateUSDC, flag, etc...]
    if (items.length > 1 && Number(items[0][0]) > Number(items[items.length - 1][0])) {
      items = items.reverse();
    }
    const ordersWithProperties = items.map(order => ({
      unitPrice: Number(order[0]),
      totalAmount: Number(order[1]),
      totalVolume: Number(order[0]) * Number(order[1]),
      rateUSDC: Number(order[2]),
      flag: Boolean(order[3]),
      // Uncomment next line for testing:
      // flag: Math.random() > 0.5,
    }));
    let slicedOrders = [];
    if (type === 'ask') {
      slicedOrders = ordersWithProperties
        .slice(0, 25)
        .reverse()
        .sort((a, b) => compare(a, b, 'unitPrice'));
      Vue.set(state, 'orderBookAsk', slicedOrders);
    } else {
      slicedOrders = ordersWithProperties
        .slice(-25)
        .sort((a, b) => compare(a, b, 'unitPrice'));
      Vue.set(state, 'orderBookBid', slicedOrders);
    }
  },

  [ORDER_BOOK_CHART](state, { type, items }) {
    // Convert stringified numbers into numbers
    if (items.length > 1 && Number(items[0][0]) > Number(items[items.length - 1][0])) {
      items = items.reverse();
    }
    let converted = items.map(data => data.map(number => Number(number)));
    if (converted.length === 0) {
      Vue.set(state.orderBookChart, type, []);
      return;
    }
    let withTotal = [];
    if (type === 'ask') {
      converted = converted.slice(0, 25);
      if (converted[0][0] > converted[converted.length - 1][0]) {
        converted = converted.reverse();
      }
      withTotal = calculateChartTotals(converted, true);
    } else {
      converted = converted.slice(-25).reverse();
      withTotal = calculateChartTotals(converted, true).reverse();
    }
    Vue.set(state.orderBookChart, type, withTotal);
  },

};
