/* ============
 * Actions for the order module
 * ============
 *
 * The actions that are available on the
 * order module.
 */

import Proxy from '@/proxies/OrderProxy';
import * as types from './mutation-types';

/**
 * Gets user orders
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const userOrders = async ({ commit }, params) => {
  commit(types.LOADING, { action: 'userOrders', val: true });
  commit(types.USER_ORDERS, []);
  const response = await new Proxy().listUserOrders(params);
  console.log('+++++++++++++', response.result.orders);
  commit(types.USER_ORDERS, response.result.orders);
  commit(types.LOADING, { action: 'userOrders', val: false });
  return response;
};

/**
 * Gets user orders by email
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const userFindOrders = async ({ commit }, params) => {
  commit(types.LOADING, { action: 'userFindOrders', val: true });
  commit(types.USER_FIND_ORDERS, []);
  const response = await new Proxy().listUserOrders(params);
  commit(types.USER_FIND_ORDERS, response.result.orders);
  commit(types.LOADING, { action: 'userFindOrders', val: false });
  return response;
};

/**
 * Appends user order array
 *
 * @param {Object} context The store object
 * @param {Object} params The user order object
 */
export const userOrdersAdd = async ({ commit }, params) => {
  const response = await new Proxy().listUserOrders(params);
  commit(types.USER_ORDERS_ADD, response.result.orders);
  return response;
};

/**
 * Adds new user order
 *
 * @param {Object} context The store object
 * @param {Object} item The user order object
 */
export const userOrdersNew = async ({ commit }, item) => {
  commit(types.USER_ORDERS_NEW, item);
};

/**
 * Removes user order
 *
 * @param {Object} context The store object
 * @param {Object} id The user order ID
 */
export const userOrdersRemove = async ({ commit }, id) => {
  commit(types.USER_ORDERS_REMOVE, id);
};

/**
 * Resets user orders in the store
 *
 * @param {Object} context The store object
 */
export const reset = ({ commit }) => {
  commit(types.USER_ORDERS, []);
};

export default {
  userOrders,
  userFindOrders,
  userOrdersAdd,
  userOrdersNew,
  userOrdersRemove,
  reset,
};
