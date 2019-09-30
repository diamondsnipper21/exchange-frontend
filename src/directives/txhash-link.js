/* ============
 * Crypto transaction hash link directive
 * ============
 *
 * Renders a link to a crypto block explorer by txhash and currency
 */

import Vue from 'vue';

/**
 * Combines hash with url depending on currency
 * @param {String} txHash hash
 * @param {String} currency given currency name
 * @returns {String} formatted link
 */
export function renderLink(txHash, currency, link) {
  // eslint-disable-next-line no-template-curly-in-string
  return link.replace('${currency}', currency).replace('${txHash}', txHash);
}

/**
 * Formats hash string showing only first and last characters
 * @param {String} txHash hash string
 * @returns {String} formatted hash string
 */
export function breakTxHash(txHash) {
  return txHash ? `${txHash.substr(0, 10)}...${txHash.substr(-10, 10)}` : '';
}

Vue.directive('txhash-link', {
  bind(el, binding) {
    const link = binding.value.breakHash ? breakTxHash(binding.value.txHash) : binding.value.txHash;
    if (!binding.modifiers['with-icon']) {
      el.innerHTML = link;
    }
    const newLink = renderLink(binding.value.txHash, binding.value.currency,
      binding.value.explorerLink);
    if (newLink !== '') {
      el.href = newLink;
      el.target = '_blank';
      el.title = 'View on block explorer';
    }
  },
  update: (el, binding) => {
    if (binding.oldValue !== binding.value) {
      const txHash = binding.value.txHash;
      if (!binding.modifiers['with-icon']) {
        el.innerHTML = binding.value.breakHash ? breakTxHash(txHash) : txHash;
      }
      const newLink = renderLink(txHash, binding.value.currency, binding.value.explorerLink);

      if (newLink !== '') {
        el.href = newLink;
      }
    }
  },
});
