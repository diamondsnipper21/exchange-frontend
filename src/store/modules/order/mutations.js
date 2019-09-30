/* ============
 * Mutations for the order module
 * ============
 *
 * The mutations that are available on the
 * order module.
 */

import Vue from 'vue';

import {
  LOADING,
  USER_ORDERS,
  USER_FIND_ORDERS,
  USER_ORDERS_NEW,
  USER_ORDERS_REMOVE,
  USER_ORDERS_ADD,
} from './mutation-types';

export default {

  [USER_ORDERS](state, items) {
    state.action = 'orders';
    state.userOrders = items;
  },

  [USER_FIND_ORDERS](state, items) {
    state.action = 'find_orders';
    state.userFindOrders = items;
  },

  [USER_ORDERS_ADD](state, items) {
    state.action = 'add';
    state.userOrders.push(...items);
  },

  [USER_ORDERS_NEW](state, items) {
    const pos = state.userOrders.map(e => e.orderUid).indexOf(items.orderUid);
    if (pos > -1) {
      Vue.set(state.userOrders, pos, items);
    } else {
      state.userOrders.unshift(items);
    }
    state.action = 'new';
  },

  [USER_ORDERS_REMOVE](state, orderUid) {
    const pos = state.userOrders.map(e => e.orderUid).indexOf(orderUid);
    if (pos > -1) {
      state.userOrders.splice(pos, 1);
    }
    state.action = 'remove';
  },

  [LOADING](state, { action, val }) {
    state.loading[action] = val;
    state.action = 'loading';
  },
};
