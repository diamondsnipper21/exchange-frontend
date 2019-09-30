/* ============
 * Actions for the account module
 * ============
 *
 * The actions that are available on the
 * account module.
 */

import UserProxy from '@/proxies/UserProxy';
import store from '@/store';
import * as types from './mutation-types';

/**
 * Init main data for the account section
 *
 * @param {Object} context The store object
 */
export const init = async ({ commit }) => {
  // get market settings
  await store.dispatch('market/settings');
  // get currencies
  await store.dispatch('market/currencies');
  // get wallets
  await store.dispatch('wallet/list', {});

  commit(types.READY, true);
};

/**
 * Gets user details and commits USER mutation
 *
 * @param {Object} context The store object
 */
export const getUser = async ({ commit }) => {
  try {
    const response = await new UserProxy().getUser();
    commit(types.USER, response.result.user);
  } catch (e) {
    throw e;
  }
};

/**
 * Resets user details in the store
 *
 * @param {Object} context The store object
 */
export const reset = ({ commit }) => {
  commit(types.USER, null);
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
    response = await new UserProxy().statsOverView();
  } else {
    response = await new UserProxy().stats({ timeFrame });
  }
  commit(types.OVERVIEW, response.result || {});
  commit(types.LOADING_OVERVIEW, false);
};

/**
 * Gets user details by email and commits USER mutation
 *
 * @param {Object} context The store object
 */
export const getUserByEmail = async ({ commit }, { email }) => {
  try {
    const response = await new UserProxy().getUserByEmail({ email });
    commit(types.USERBYEMAIL, response.result.user);
  } catch (e) {
    throw e;
  }
};

/**
 * Gets user details by email and commits USER mutation
 *
 * @param {Object} context The store object
 */
export const getAccessLog = async ({ commit }, { findUserUid }) => {
  try {
    const response = await new UserProxy().listAccessLogs({ findUserUid });
    commit(types.USERACCESS, response.result.accessLogs);
  } catch (e) {
    commit(types.USERACCESS, null);
  }
};

export default {
  init,
  getUser,
  getUserByEmail,
  getAccessLog,
  reset,
  overview,
};
