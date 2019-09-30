/* ============
 * Mutations for the admin module
 * ============
 *
 * The mutations that are available on the
 * admin module.
 */
import {
  READY,
  OVERVIEW,
  EARNINGS,
  LOADING_OVERVIEW,
  PROJECT_SETTINGS,
  STATISTICS_CURRENT_TIMEFRAME,
  NEW_USERS,
  RECENT_TRADES,
} from './mutation-types';

export default {
  [READY](state, val) {
    state.ready = val;
  },

  [OVERVIEW](state, val) {
    state.overview = val;
  },

  [NEW_USERS](state, val) {
    state.newUsers = val;
  },

  [RECENT_TRADES](state, val) {
    state.recentTrades = val;
  },

  [EARNINGS](state, val) {
    state.earnings = val;
  },

  [LOADING_OVERVIEW](state, val) {
    state.overviewLoading = val;
  },

  [PROJECT_SETTINGS](state, val) {
    state.projectSettings = val;
  },

  [STATISTICS_CURRENT_TIMEFRAME](state, val) {
    state.statisticsCurrentTimeframe = val;
  },
};
