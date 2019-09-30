/* ============
 * Actions for the admin module
 * ============
 *
 * The actions that are available on the
 * admin module.
 */

// import store from '@/store';
import store from '@/store';
import Proxy from '@/proxies/PartnerProxy';
import * as types from './mutation-types';

/**
 * Init main data for the admin section
 *
 * @param {Object} context The store object
 */
export const init = async ({ commit }) => {
  await store.dispatch('admin/projectSettingsByAdmin');
  commit(types.READY, true);
};

/**
 * Gets project details
 *
 * @param {Object} context The store object
 */
export const projectSettingsByAdmin = async ({ commit }) => {
  try {
    const response = await new Proxy().getProject();
    commit(types.PROJECT_SETTINGS, response.result.project);
  } catch (e) {
    // user is not admin
  }
};

/**
 * Gets overview
 *
 * @param {Object} context The store object
 *
 * @param {Object} timeFrame Time bounds for data to load
 */
export const overview = async ({ commit }, timeFrame) => {
  commit(types.LOADING_OVERVIEW, true);
  let response;
  if (!timeFrame || timeFrame === 'All') {
    response = await new Proxy().getOverview();
  } else {
    response = await new Proxy().getOverviewInterval({ timeFrame });
  }
  commit(types.OVERVIEW, response.result || {});
  commit(types.LOADING_OVERVIEW, false);
};

/**
 * Gets earnings
 *
 * @param {Object} context The store object
 *
 * @param {Object} page The page to load
 */
export const earnings = async ({ commit }, page) => {
  const response = await new Proxy().getEarnings(page);
  commit(types.EARNINGS, response.result || {});
};

/**
 * Gets last registered users
 *
 * @param {Object} context The store object
 *
 * @param {Object} count Count of users to load
 */
export const newUsers = async ({ commit }, count) => {
  const response = await new Proxy().getNewUsers(count);
  commit(types.NEW_USERS, response.result.users || []);
};

/**
 * Gets last transactions
 *
 * @param {Object} context The store object
 *
 * @param {Object} count Count of transactions to load
 */
export const recentTrades = async ({ commit }, count) => {
  const response = await new Proxy().getRecentTrades(count);
  commit(types.RECENT_TRADES, response.result.trades || []);
};

/**
 * Sets current statistics charts timeframe
 *
 * @param {Object} context The store object
 * @param {Object} value The statistics current timeframe
 */
export const setStatisticsCurrentTimeframe = ({ commit }, value) => {
  commit(types.STATISTICS_CURRENT_TIMEFRAME, value);
};

export default {
  init,
  overview,
  projectSettingsByAdmin,
  setStatisticsCurrentTimeframe,
  earnings,
  newUsers,
  recentTrades,
};
