/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
export default [
  {
    path: '/trade/:market?',
    name: 'trade.index',
    component: () => import('@/pages/Trade/Index'),
    props: route => ({ market: route.query.market, referral: route.query.referral }),
  },
  {
    path: '/account',
    component: () => import('@/pages/Account/Index'),
    meta: {
      auth: true,
    },
    children: [
      {
        name: 'account.dashboard',
        path: 'dashboard',
        component: () => import('@/pages/Account/Dashboard'),
      },
      {
        name: 'account.wallet',
        path: 'wallet',
        component: () => import('@/pages/Account/Wallet'),
      },
      // {
      //   name: 'account.withdrawals',
      //   path: 'withdrawals',
      //   component: () => import('@/pages/Account/Withdrawals'),
      // },
      // {
      //   name: 'account.deposits',
      //   path: 'deposits',
      //   component: () => import('@/pages/Account/Deposits'),
      // },
      // {
      //   name: 'account.tradeHistory',
      //   path: 'history',
      //   component: () => import('@/pages/Account/History'),
      // },
      {
        name: 'account.openOrders',
        path: 'orders',
        component: () => import('@/pages/Account/Orders'),
      },
      {
        name: 'account.settings',
        path: 'settings',
        component: () => import('@/pages/Account/Settings'),
      },
      {
        name: 'account.referral',
        path: 'referral',
        component: () => import('@/pages/Account/Referral'),
      },
      {
        name: 'account.vouchers',
        path: 'vouchers',
        component: () => import('@/pages/Account/Vouchers'),
      },
      {
        name: 'account.recent',
        path: 'recent',
        component: () => import('@/pages/Account/Recent'),
      },
      {
        name: 'account.admin',
        path: 'admin',
        component: () => import('@/pages/Account/Admin/Index'),
        meta: {
          auth: true,
        },
        children: [
          {
            name: 'account.admin.overview',
            path: 'overview',
            component: () => import('@/pages/Account/Admin/Overview'),
            meta: {
              admin: true,
            },
          },
          {
            name: 'account.admin.users',
            path: 'users',
            component: () => import('@/pages/Account/Admin/Users'),
            meta: {
              admin: true,
            },
          },
          {
            name: 'account.admin.orders',
            path: 'orders',
            component: () => import('@/pages/Account/Admin/Orders'),
            meta: {
              admin: true,
            },
          },
          {
            name: 'account.admin.earnings',
            path: 'earnings',
            component: () => import('@/pages/Account/Admin/Warnings'),
            meta: {
              admin: true,
            },
          },
          {
            name: 'account.admin.wallets',
            path: 'wallets',
            component: () => import('@/pages/Account/Admin/Wallets'),
            meta: {
              admin: true,
            },
          },
          {
            name: 'account.admin.settings',
            path: 'settings',
            component: () => import('@/pages/Account/Admin/Settings'),
            meta: {
              admin: true,
            },
          },
        ],
      },
    ],
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/Auth/Register.vue'),
    meta: {
      guest: true,
    },
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Auth/LogIn.vue'),
    meta: {
      guest: true,
    },
  },

  {
    path: '/recover',
    name: 'recover',
    component: () => import('@/pages/Auth/ForgotPassword.vue'),
    meta: {
      guest: true,
    },
  },

  {
    path: '/emails',
    component: () => import('@/pages/Emails/Index'),
    children: [
      {
        name: 'emails.confirmAccount',
        path: 'ca/:token',
        component: () => import('@/pages/Emails/ConfirmAccount'),
      },
      {
        name: 'emails.confirmNewIP',
        path: 'cip/:token',
        component: () => import('@/pages/Emails/ConfirmNewIP'),
      },
      {
        name: 'emails.recoverPassword',
        path: 'rp/:token',
        component: () => import('@/pages/Emails/RecoverPassword'),
      },
      {
        name: 'emails.confirmPayment',
        path: 'cpmt/:token',
        component: () => import('@/pages/Emails/ConfirmPayment'),
      },
    ],
  },

  {
    path: '/partner-register',
    name: 'partner-register',
    component: () => import('@/pages/Partner/Register.vue'),
    meta: {
      guest: true,
    },
  },

  {
    path: '/',
    redirect: '/trade',
  },

  {
    path: '/*',
    redirect: '/trade',
  },
];
