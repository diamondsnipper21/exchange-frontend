/* ============
 * Mutations for the wallet module
 * ============
 *
 * The mutations that are available on the
 * wallet module.
 */

import Vue from 'vue';

import {
  LIST,
  LIST_CLIENT,
  LOADING,
  READY,
  DEPOSITS,
  DEPOSITS_ADD,
  PAYMENTS,
  PAYMENTS_ADD,
  TRANSACTIONS,
  LIST_BY_ACCOUNT,
} from './mutation-types';

export default {
  [LIST](state, items) {
    state.list = {};
    // set coin abbr as key
    items.forEach((item) => {
      Vue.set(state.list, item.currency, item);
    });
  },

  [LIST_CLIENT](state, items) {
    state.listClient = {};
    // set coin abbr as key
    items.forEach((item) => {
      Vue.set(state.listClient, item.currency, item);
    });
  },

  [LIST_BY_ACCOUNT](state, items) {
    state.list_by_account = {};
    // set coin abbr as key
    items.forEach((item) => {
      Vue.set(state.list_by_account, item.currency, item);
    });
  },

  [LOADING](state, val) {
    state.loading = val;
  },

  [READY](state, val) {
    state.ready = val;
  },

  [DEPOSITS](state, items) {
    state.deposits = items;
  },

  [DEPOSITS_ADD](state, items) {
    state.userOrders.push(...items);
  },

  [PAYMENTS](state, items) {
    state.payments = items;
  },

  [PAYMENTS_ADD](state, items) {
    state.userOrders.push(...items);
  },

  [TRANSACTIONS](state, items) {
    state.transactions = items;
  },
};
