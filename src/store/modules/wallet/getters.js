/* ============
 * Getters for the wallet module
 * ============
 *
 * The getters that are available on the
 * wallet module.
 */

export default {
  list(state) {
    return state.list;
  },

  listByAccount(state) {
    return state.list_by_account;
  },

  listClient(state) {
    return state.listClient;
  },

  loading(state) {
    return state.loading;
  },

  ready(state) {
    return state.ready;
  },

  deposits(state) {
    return state.deposits;
  },

  payments(state) {
    return state.payments;
  },

  transactions(state) {
    return state.transactions;
  },
};
