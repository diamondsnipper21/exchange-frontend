/**
 * A dumb authorization class that check if current user can perform certain actions.
 */
export default class CCAuthorization {
  constructor() {
    this.permissions = undefined;
  }

  /**
   * Check if current user can execute a specific type of orders.
   *
   * @param orderType
   * @returns {boolean}
   */
  canPerformOrderType(orderType) {
    return this.canPerformTradeAction('buy', orderType) ||
      this.canPerformTradeAction('sell', orderType);
  }

  /**
   * Check if there's any restrictions on the sell/buy action on given order type.
   *
   * @param tradeAction
   * @param orderType
   * @returns {boolean}
   */
  canPerformTradeAction(tradeAction, orderType) {
    // @TODO maybe deny permissions by default?
    let allow = true;
    if (this.permissions && this.permissions[tradeAction]) {
      allow = this.permissions[tradeAction][orderType];
    }
    return allow;
  }

  /**
   * Update internal matrix.
   *
   * @param defaultTradeActions
   * @param defaultOrderTypes
   * @param restrictions
   * @param currentUser
   * @returns {*}
   */
  updateTradePermissionMatrix(
    defaultTradeActions, defaultOrderTypes, restrictions, currentUser,
    ) {
    this.permissions = CCAuthorization.buildTradePermissionMatrix(
      defaultTradeActions, defaultOrderTypes, restrictions, currentUser,
    );
    return this.permissions;
  }

  /**
   * Build trading actions permissions matrix for the current user.
   * @see `doc/authorization.md` for details.
   *
   * @param defaultTradeActions
   * @param defaultOrderTypes
   * @param restrictions
   * @param currentUser
   * @returns {*}
   */
  static buildTradePermissionMatrix(
    defaultTradeActions, defaultOrderTypes, restrictions, currentUser) {
    const permissions = {};

    // Build a fully-permissive matrix
    defaultTradeActions.forEach((action) => {
      permissions[action] = {};
      defaultOrderTypes.forEach((orderType) => {
        permissions[action][orderType] = true;
      });
    });

    if (!restrictions) {
      return permissions;
    }
    // Apply any trading restrictions available at project/currency/market level
    Object.keys(restrictions).forEach((tradeAction) => {
      const rules = restrictions[tradeAction];
      Object.keys(rules).forEach((property) => {
        const allowedValues = rules[property];
        // Restrict trade action for specific order types (eg. only allow market buys)
        if (property === 'order') {
          Object.keys(permissions[tradeAction]).forEach((orderType) => {
            permissions[tradeAction][orderType] = allowedValues.indexOf(
              orderType) > -1;
          });
        }
        // Restrict trade actions for specific user (for all order types)
        // (eg. exclusive sellers/buyers)
        if (property === 'userUid' && currentUser) {
          Object.keys(permissions[tradeAction]).forEach((orderType) => {
            permissions[tradeAction][orderType] = allowedValues.indexOf(
              currentUser.userUid) > -1;
          });
        }
      });
    });
    return permissions;
  }
}
