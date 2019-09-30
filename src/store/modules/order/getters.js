/* ============
 * Getters for the order module
 * ============
 *
 * The getters that are available on the
 * order module.
 */

export default {

  userOrders(state) {
    return state.userOrders;
  },

  userFindOrders(state) {
    return state.userFindOrders;
  },

  action(state) {
    return state.action;
  },

  loading(state) {
    return action => state.loading[action];
  },
};
