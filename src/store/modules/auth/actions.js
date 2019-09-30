/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from 'vue';
import store from '@/store';
import * as types from './mutation-types';

/**
 * Saves the authentication token
 *
 * @param {Object} context The store object
 * @param item
 */
export const save = ({ commit }, item) => {
  commit(types.SAVE, item.result.token);
};

/**
 * Checks the authentication state
 *
 * @param {Object} context The store object
 */
export const check = ({ commit }) => {
  commit(types.CHECK);
};

/**
 * Logouts and resets data related to the user
 */
export const logout = ({ commit }, location) => {
  store.dispatch('order/reset');
  store.dispatch('wallet/reset');
  store.dispatch('account/reset');
  commit(types.LOGOUT);
  if (!location) {
    location = {
      name: 'trade.index',
    };
  }
  Vue.router.push(location, () => {
    window.location.reload();
  });
};

export default {
  save,
  check,
  logout,
};
