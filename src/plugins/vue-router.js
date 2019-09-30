/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/routes';
import store from '@/store';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  /*
    Watch for the user to be loaded. When it's finished, then
    we proceed.
  */

  if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
    /*
     * If the user is not authenticated and visits
     * a page that requires authentication, redirect to the dashboard page
     */
    next({
      name: 'trade.index',
    });
  } else if (to.matched.some(m => m.meta.guest) && store.state.auth.authenticated) {
    /*
     * If the user is authenticated and visits
     * an guest page, redirect to the dashboard page
     */
    next({
      name: 'trade.index',
    });
  } else if (to.matched.some(m => m.meta.admin)) {
    store.dispatch('admin/projectSettingsByAdmin');
    let isAdmin = !!store.state.projectSettings;
    if (store.state.admin && isAdmin) {
      next();
    } else {
      store.watch(
        () => store.state.admin.projectSettings,
        (value) => {
          isAdmin = !!value;
          if (isAdmin) {
            next();
          } else {
            next({
              name: 'trade.index',
            });
          }
        },
      );
    }
  } else {
    next();
  }
});

Vue.router = router;

export default {
  router,
};
