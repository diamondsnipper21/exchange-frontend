/* ============
 * Date directive
 * ============
 *
 * Converts timestamp to time
 */

import Vue from 'vue';

/**
 * Converts given timestamp into date string
 * @param {Number} timestamp time in milliseconds
 * @returns {String} format `YYYY-MM-DD HH:mm:ss`
 */
export default function convert(timestamp) {
  if (!timestamp) return '&nbsp;';
  const date = new Date(timestamp);
  const year = `${date.getFullYear()}`.substr(-2);
  const month = `0${date.getMonth() + 1}`.substr(-2);
  const day = `0${date.getDate()}`.substr(-2);
  const hours = `0${date.getHours()}`.substr(-2);
  const minutes = `0${date.getMinutes()}`.substr(-2);
  const seconds = `0${date.getSeconds()}`.substr(-2);
  return `20${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function convertShort(timestamp) {
  const date = new Date(timestamp);
  const month = `0${date.getMonth() + 1}`.substr(-2);
  const day = `0${date.getDate()}`.substr(-2);
  return `${month}/${day}`;
}

Vue.directive('date', {
  bind(el, binding) {
    if (binding.modifiers.short) {
      el.innerHTML = convertShort(binding.value);
    } else {
      el.innerHTML = convert(binding.value);
    }
  },
  update: (el, binding) => {
    if (binding.oldValue !== binding.value) {
      if (binding.modifiers.short) {
        el.innerHTML = convertShort(binding.value);
      } else {
        el.innerHTML = convert(binding.value);
      }
    }
  },
});
