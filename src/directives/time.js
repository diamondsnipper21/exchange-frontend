/* ============
 * Time directive
 * ============
 *
 * Converts timestamp to time
 */

import Vue from 'vue';

/**
 * Converts given timestamp into time string
 * @param {Number} timestamp time in milliseconds
 * @returns {String} format `HH:mm:ss`
 */
export default function convert(timestamp) {
  const date = new Date(timestamp);
  const hours = `0${date.getUTCHours()}`;
  const minutes = `0${date.getUTCMinutes()}`;
  const seconds = `0${date.getUTCSeconds()}`;
  return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}

Vue.directive('time', {
  bind(el, binding) {
    el.innerHTML = convert(binding.value);
  },
  update: (el, binding) => {
    if (binding.oldValue !== binding.value) {
      el.innerHTML = convert(binding.value);
    }
  },
});
