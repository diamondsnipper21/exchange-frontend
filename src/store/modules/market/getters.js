/* ============
 * Getters for the market module
 * ============
 *
 * The getters that are available on the
 * market module.
 */

export default {
  list(state) {
    return state.list;
  },

  defaultMarketPair(state) {
    return state.defaultMarketPair;
  },

  defaultFavoritePairs(state) {
    return state.defaultFavoritePairs;
  },

  favoritePairs(state) {
    return state.favoritePairs;
  },

  favoritePairsSummaries(state) {
    return state.favoritePairsSummaries;
  },

  loadingDefaultFavoritePairs(state) {
    return state.loadingDefaultFavoritePairs;
  },

  loadingFavoritePairs(state) {
    return state.loadingFavoritePairs;
  },

  loadingFavoritePairsSummaries(state) {
    return state.loadingFavoritePairsSummaries;
  },

  type(state) {
    return state.activeType;
  },

  currency(state) {
    return state.activeCurrency;
  },
  current(state) {
    return (state.settings[state.activeType] &&
    state.settings[state.activeType][state.activeCurrency]) ?
    state.settings[state.activeType][state.activeCurrency] : {};
  },

  info(state) {
    return state.info;
  },

  history(state) {
    return state.tradeHistory;
  },

  settings(state) {
    return state.settings;
  },

  settings_all(state) {
    return state.settings_all;
  },

  currencies(state) {
    return state.currencies;
  },

  currenciesArr(state) {
    return state.currenciesArr;
  },

  loading(state) {
    return state.loading;
  },

  loadingArray(state) {
    return action => state.loadingArray[action];
  },

  loadingList(state) {
    return state.loadingList;
  },

  loadingHistory(state) {
    return state.loadingHistory;
  },

  ready(state) {
    return state.ready;
  },

  exchangeRate(state) {
    return state.exchangeRate;
  },

  markets(state) {
    return state.markets;
  },

  ask(state) {
    return state.orderBookAsk;
  },

  bid(state) {
    return state.orderBookBid;
  },

  chartAsk(state) {
    return state.orderBookChart.ask;
  },

  chartBid(state) {
    return state.orderBookChart.bid;
  },
};
