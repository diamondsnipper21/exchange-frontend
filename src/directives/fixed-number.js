/* ============
 * FixedNumbers directive
 * ============
 *
 * Formats numbers
 */

import Vue from 'vue';
import Big from 'big.js';

/**
 * Formats number using `Big` library
 * @param {Number} number given number
 */
export default function format(number, total = 6) {
  if (!(!isNaN(parseFloat(number)) && isFinite(number))) {
    return number;
  }
  const dec = parseFloat(number) >= 1 ? 2 : total;
  return new Big(number).round(dec, 0).toFixed(dec);
}

Vue.directive('fixed-number', {
  bind(el, binding) {
    if (binding.arg === '2') {
      el.innerHTML = format(binding.value, 8);
    } else {
      el.innerHTML = format(binding.value);
    }
  },
  update: (el, binding) => {
    if (binding.oldValue !== binding.value) {
      if (binding.arg === '2') {
        el.innerHTML = format(binding.value, 8);
      } else {
        el.innerHTML = format(binding.value);
      }
    }
  },
});
