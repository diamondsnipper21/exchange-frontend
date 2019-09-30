/* ============
 * Vuetify
 * ============
 *
 * Material Component Framework
 *
 * https://vuetifyjs.com/
 */

import Vue from 'vue';

import {
  Vuetify, // required
  VApp, // required
  VNavigationDrawer,
  VAlert,
  VBottomNav,
  VList,
  VBtn,
  VBtnToggle,
  VCheckbox,
  VDataIterator,
  VDataTable,
  VDialog,
  VDivider,
  VForm,
  // VPagination,
  VRadioGroup,
  VSelect,
  VSystemBar,
  VTabs,
  VTextField,
  VToolbar,
  // VTooltip,
  VMenu,
  VIcon,
  VGrid,
  VProgressCircular,
  VProgressLinear,
  VExpansionPanel,
  VCard,
  VCarousel,
  transitions,
} from 'vuetify';
import { Ripple, Resize } from 'vuetify/es5/directives';

import '../assets/stylus/main.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VAlert,
    VBottomNav,
    VList,
    VBtn,
    VBtnToggle,
    VCheckbox,
    VDataIterator,
    VDataTable,
    VDialog,
    VDivider,
    VForm,
    // VPagination,
    VRadioGroup,
    VSelect,
    VSystemBar,
    VTabs,
    VTextField,
    VToolbar,
    // VTooltip,
    VMenu,
    VIcon,
    VGrid,
    VProgressCircular,
    VProgressLinear,
    VExpansionPanel,
    VCard,
    VCarousel,
    transitions,
  },
  directives: {
    Ripple,
    Resize,
  },
});
