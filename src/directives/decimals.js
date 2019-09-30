/* ============
 * Decimals directive
 * ============
 *
 * Adds zeros and opacity
 */

import Vue from 'vue';
import Big from 'big.js';

/**
 * Adds CSS classes and formats given value
 * @param {*} value
 * @return {String}
 */
export function zeros(value) {
  if (value === undefined) {
    return '';
  }
  value = value.toString();
  if (value === '0' || value.indexOf('.') === -1) {
    return value;
  }

  let sign = '';
  if (value[0] === '-') sign = '-';
  else if (value[0] === '+') sign = '+';

  const stringParts = value.replace('-', '').replace('+', '').split('.');
  const regExp = /[0]+$/;
  const output = value.match(regExp);

  const head = stringParts[0] === '0'
    ? '<span class="cce-trade__opacity">0</span>'
    : stringParts[0];

  const tail = output
    ? `${stringParts[1].replace(regExp, '')}<span class="cce-trade__opacity">${output[0]}</span>`
    : stringParts[1];

  return `${sign}${head}.${tail}`;
}

// to fixed
export function decimals(value, precision) {
  if (typeof value === 'object' && value.text === 0 && precision) {
    let zeroChars = '';
    for (let i = 0; i < precision; i += 1) {
      zeroChars += '0';
    }
    return `0.${zeroChars}`;
  }
  if (!(!isNaN(parseFloat(value)) && isFinite(value))) {
    return value;
  }

  if (precision) {
    return new Big(parseFloat(value)).toFixed(precision);
  }
  return new Big(parseFloat(value)).toFixed(Math.abs(parseFloat(value)) >= 1 ? 2 : 6);
}

Vue.directive('decimals', {
  bind(el, binding) {
    let value = binding.value;
    if (binding.modifiers['include-zero-value']) {
      value = decimals(value.text, value.precision);
    } else if (value && value.text) {
      value = decimals(value.text, value.precision);
    } else {
      value = decimals(value);
    }
    el.innerHTML = zeros(value);
  },
  update: (el, binding) => {
    let value = binding.value;
    if (binding.modifiers['include-zero-value']) {
      value = decimals(value.text, value.precision);
    } else if (value && value.text) {
      value = decimals(value.text, value.precision);
    } else {
      value = decimals(value);
    }
    el.innerHTML = zeros(value);
  },
});
