/* ============
 * Actions for the wallet module
 * ============
 *
 * The actions that are available on the
 * wallet module.
 */

import Proxy from '@/proxies/WalletProxy';
import * as types from './mutation-types';

/**
 * Lists user wallets
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const list = async ({ commit, state }, params) => {
  commit(types.LOADING, true);
  const response = await new Proxy().listWallets(params);
  commit(types.LOADING, false);
  commit(types.READY, true);
  commit(types.LIST, response.result.wallets);
};

/**
 * Lists client wallets
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const listClient = async ({ commit, state }, params) => {
  const response = await new Proxy().listClients(params);
  commit(types.LIST_CLIENT, response.result.clients);
};


/**
 * Lists user deposits
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const deposits = async ({ commit, state }, params) => {
  const response = await new Proxy().listTransactions({
    ...params,
    paymentType: 'CR',
  });
  commit(types.DEPOSITS, response.result.deposits);
  return response;
};

/**
 * Append user deposits
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const depositsAdd = async ({ commit, state }, params) => {
  const response = await new Proxy().listTransactions({
    ...params,
    paymentType: 'CR',
  });
  commit(types.DEPOSITS_ADD, response.result.deposits);
  return response;
};

/**
 * Lists user payments
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const payments = async ({ commit, state }, params) => {
  const response = await new Proxy().listTransactions({
    ...params,
    paymentType: 'DB',
  });
  commit(types.PAYMENTS, response.result.payments);
  return response;
};

/**
 * Append user payments
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const paymentsAdd = async ({ commit, state }, params) => {
  const response = await new Proxy().listTransactions({
    ...params,
    paymentType: 'DB',
  });
  commit(types.PAYMENTS_ADD, response.result.payments);
  return response;
};

/**
 * Lists user transactions
 * @param {Object} context the store object
 * @param {Object} params the params object
 */
export const transactions = async ({ commit }, params) => {
  const response = await new Proxy().listTransactions({
    ...params,
    paymentType: 'ALL',
  });
  commit(types.TRANSACTIONS, response.result);
  return response;
};

/**
 * Lists user wallets
 *
 * @param {Object} context The store object
 * @param {Object} params The params object
 */
export const listByAccount = async ({ commit, state }, params) => {
  commit(types.LIST_BY_ACCOUNT, []);
  commit(types.LOADING, true);
  const response = await new Proxy().listWallets(params);
  commit(types.LOADING, false);
  commit(types.READY, true);
  commit(types.LIST_BY_ACCOUNT, response.result.wallets);
  return response;
};


/**
 * Resets user wallets data in the store
 *
 * @param {Object} context The store object
 */
export const reset = ({ commit }) => {
  commit(types.LIST, []);
};

export default {
  list,
  listByAccount,
  listClient,
  deposits,
  depositsAdd,
  payments,
  paymentsAdd,
  reset,
  transactions,
};
