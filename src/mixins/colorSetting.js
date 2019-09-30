export default function getColorSetting(setting) {
  return {
    // Border Bottom Color Setting with PageBackgroundColor
    COLOR_TYPE_BORDER_BOTTOM: {
      classList: [
        '.cce-trade__panel-title',
        '.cce-admin__panel-title',
        '.cce-trade__table-header',
        '.cce-account__navigation hr',
        '.cce-trade__panel-orders-stats',
        '.cce-trade__datatable .table thead tr:first-child',
        '.cce-trade__table-tr',
        '.cce-wallet-zero-balance__header',
        '.cce-trade__datatable .table tbody tr:not(:last-child)',
      ],
      colorList: [
        setting.themeSettings.darkPageBackgroundColor,
        setting.themeSettings.lightPageBackgroundColor,
      ],
      style: 'border-bottom-color',
    },

    // Border Left Color Setting with PageBackgroundColor
    COLOR_TYPE_BORDER_LEFT: {
      classList: [
        '.cce-trade__table__container::-webkit-scrollbar-track',
        '.cce-trade__table-body--with-scrollbar::-webkit-scrollbar-track',
        '.cce-trade__bar-icons',
        '.cce-trade__trade-form-control-arrows',
      ],
      colorList: [
        setting.themeSettings.darkPageBackgroundColor,
        setting.themeSettings.lightPageBackgroundColor,
      ],
      style: 'border-left-color',
    },

    // Border Left Color Setting with PageBackgroundColor
    COLOR_TYPE_BORDER_TOP: {
      classList: [
        '.cce-trade__panel-orders-stats',
        '.cce-trade__trade-form-control-arrows-down',
        '.static-menu',
        '.cce-orders-total__content',
        '.cce-admin_panel_top_border',
        '.cce-trade__depth-chart',
      ],
      colorList: [
        setting.themeSettings.darkPageBackgroundColor,
        setting.themeSettings.lightPageBackgroundColor,
      ],
      style: 'border-top-color',
    },

    // Background Setting with PageBackground Color
    COLOR_TYPE_PAGE_BACKGROUND: {
      classList: [
        '.theme--dark',
        '.theme--light',
        '.cce-account__navigation',
        '.list__tile--active',
        '.list__tile--link:hover',
      ],
      colorList: [
        setting.themeSettings.darkPageBackgroundColor,
        setting.themeSettings.lightPageBackgroundColor,
      ],
    },

    // Background Setting with Brand COlor
    COLOR_TYPE_BRAND: {
      classList: [
        '.cce-account__toolbar',
        '.cce-account__navigation-list',
        '.tabs__bar',
        '.cce-admin_panel-control-input-text',
        '.cce-admin-modal__container',
        '.cce-admin__panel-title',
        '.cce-admin_panel-kyc-panel',
        '.cce-admin_panel-2fa-status',
        '.cce-pair-selector__activator',
        '.cce-pair-selector-content',
        '.referral__layout .panel-link',
        '.theme--dark .resp-tab table thead th',
        '.expansion-panel__container',
        '.cce-wallets__header',
        '.cce-wallet-zero-balance__header',
        '.cce-wallet-currency',
        '.cce-wallets__button',
        '.toolbar--fixed',
        '.cce-trade__panel-title',
        '.cce-trade__panel-orders-stats',
        '.cce-trade__trade-form-control-input',
        '.cce-trade__trade-form-control-currency',
        '.cce-trade__trade-form-control-arrows',
        '.cce-trade__trade-form-total',
        '.cce-trade__table__container::-webkit-scrollbar-track',
        '.cce-trade__table-tr:hover, .cce-trade__table-hover:hover',
        '.cce-trade__table-body--with-scrollbar::-webkit-scrollbar-track',
        '.cce-trade__trade-form-volume-btn',
        '.cce-trade__btn-disabled > *',
        '.cce-admin_panel-control-button',
        '.cce-admin_panel-control-button btn',
        '.tabs__container',
        '.cce-auth-bg-image',
      ],
      colorList: [
        setting.themeSettings.darkBrandColor,
        setting.themeSettings.lightBrandColor,
      ],
    },
    // Background Setting with Brand COlor
    COLOR_TYPE_CONTAINER: {
      classList: [
        '.cce-admin__panel',
        '.tabs__item--active',
        '.cce-admin-modal__content',
        '.cce-trade__table-body--with-scrollbar',
        '.cce-orders-total',
        '.cce-wallet-zero-balance__content',
        '.cce-wallets__table-row',
        '.cce-trade__panel',
        '.cce-trade__market-content',
        '.cce-trade__btn-disabled',
        '.btn-toggle',
        '.material-icons',
        '.card__text',
        '.cce-account__content .input-group input',
        // '.cce-trade__trading-view iframe',
        '.cce-trade__trading-view',
        '.cce-trade__highcharts',
        '.cce-trade__depth-chart',
      ],
      colorList: [
        setting.themeSettings.darkContainerBackgroundColor,
        setting.themeSettings.lightContainerBackgroundColor,
      ],
    },

    COLOR_TYPE_CONTAINE_FILL: {
      classList: [
        '.highcharts-background',
      ],
      colorList: [
        setting.themeSettings.darkContainerBackgroundColor,
        setting.themeSettings.lightContainerBackgroundColor,
      ],
      style: 'fill',
    },

    // Background Setting with Buy Color
    COLOR_TYPE_BUY_COLOR: {
      classList: [
        '.cce-color__high',
      ],
      colorList: [
        setting.themeSettings.darkBuyColor,
        setting.themeSettings.lightBuyColor,
      ],
      style: 'color',
    },

    COLOR_TYPE_SELL_COLOR: {
      classList: [
        '.cce-color__low',
      ],
      colorList: [
        setting.themeSettings.darkSellColor,
        setting.themeSettings.lightSellColor,
      ],
      style: 'color',
    },

    COLOR_TYPE_BUY_BACKGROUND: {
      classList: [
        '.cce-trade__trade-form-toggle-ask',
      ],
      colorList: [
        setting.themeSettings.darkBuyColor,
        setting.themeSettings.lightBuyColor,
      ],
    },

    COLOR_TYPE_SELL_BACKGROUND: {
      classList: [
        '.cce-trade__trade-form-toggle-bid',
      ],
      colorList: [
        setting.themeSettings.darkSellColor,
        setting.themeSettings.lightSellColor,
      ],
    },

    COLOR_TYPE_BUY_BORDER: {
      classList: [
        '.cce-trade__trade-form-toggle-ask',
        '.cce-trade__trade-form-action-ask',
      ],
      colorList: [
        setting.themeSettings.darkBuyColor,
        setting.themeSettings.lightBuyColor,
      ],
      style: 'border-color',
    },

    COLOR_TYPE_SELL_BORDER: {
      classList: [
        '.cce-trade__trade-form-toggle-bid',
        '.cce-trade__trade-form-action-bid',
      ],
      colorList: [
        setting.themeSettings.darkSellColor,
        setting.themeSettings.lightSellColor,
      ],
      style: 'border-color',
    },
  };
}
