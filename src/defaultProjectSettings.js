export default {
  // domain: 'staging-trade.chaincreator.exchange',
  projectId: '60dc05dc-9ab4-40c8-b224-b7ca59c4fc4b',
  title: 'ChainCreator | Cryptocurrency Exchange',
  themeName: 'cce',
  defaultPairs: ['BTC-USDC', 'ETH-USDC', 'XRP-USDC', 'LTC-USDC', 'ETH-BTC', 'LTC-BTC'],
  defaultMarketPair: 'BTC-USDC',
  themeSettings: {
    s3_endpoint: '',
    themeAnalyticsClient: 'UA-117801824-13',
    themeAnalyticsGlobal: 'UA-117801824-12',
    themeHotjarClient: '1150652',
    themeMode: true,
    customLogin: '#/login',
    bgUrlAuth: {
      backgroundImage: 'url(/static/img/themes/cce/blur-auth-bg.jpg)',
    },
    logoUrlAuth: '/static/img/themes/cce/logo-exchange-on-dark.svg',
    logoUrlAccount: '/static/img/themes/cce/logo-exchange-on-dark.svg',
    logoUrlBlank: '/static/img/themes/cce/logo-exchange-on-dark.svg',
    logoUrlTrade: '/static/img/themes/cce/logo-exchange-on-dark.svg',
    logoHref: 'https://chaincreator.exchange/',
    faviconUrl: '/static/img/themes/cce/logo-exchange-favicon.png',
    showAllApps: true,
    navItems: [
      {
        name: 'Dashboard',
        to: 'account.dashboard',
        icon: 'fas fa-tachometer-alt',
      },
      {
        name: 'Wallet',
        to: 'account.wallet',
        icon: 'fas fa-wallet',
        activeTabs: [
          'account.deposits',
          'account.withdrawals',
        ],
      },
      {
        name: 'Orders',
        to: 'account.openOrders',
        icon: 'fas fa-exchange-alt',
        activeTabs: [
          'account.tradeHistory',
        ],
      },
      {
        name: 'Settings',
        to: 'account.settings',
        icon: 'fas fa-sliders-h',
      },
      {
        name: 'Tickets & Vouchers',
        to: 'account.vouchers',
        icon: 'fas fa-ticket-alt',
        special: 'New',
      },
      {
        name: 'Referral',
        to: 'account.referral',
        icon: 'fas fa-link',
      },
      // {
      //   name: 'Bonus',
      //   icon: 'fa-gift',
      //   special: 'Soon',
      //   href: 'https://www.chaincreator.exchange/bonus-system',
      //   inactive: true
      // }
    ],
    navStaticPages: [
      {
        name: 'Support',
        href: 'https://www.chaincreator.exchange/support',
      },
      {
        name: 'Terms',
        href: 'https://www.chaincreator.exchange/terms',
      },
      {
        name: 'Fees',
        href: 'https://www.chaincreator.exchange/fees',
      },
    ],
    carouselItems: [
    ],
    tradeTabsOrder: [
      'limit',
      'market',
      'stop',
    ],
  },
};
