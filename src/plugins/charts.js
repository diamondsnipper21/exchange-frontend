/* ============
 * vue-highcharts
 * ============
 *
 * Highcharts component for Vue.
 *
 * https://github.com/weizhenye/vue-highcharts
 */

import Vue from 'vue';
import VueChartkick from 'vue-chartkick';
import Highcharts from 'highcharts';
import Vuehighcharts from 'vue-highcharts';


Vue.use(Vuehighcharts);
Vue.use(VueChartkick, { adapter: Highcharts });
