/* ============
 * handleErrorMessage utility function
 * ============
 *
 * returns readable error message with multilingual support
 */

import { i18n } from '@/plugins/vue-i18n';

/**
 * Uses i18n to select error translation
 *
 * @param {Object} e received error object from the backend
 * @param defaultMessage
 * @returns {String} readable error message
 */
export default function handleErrorMessage(e, defaultMessage = null) {
  let errorMessage = defaultMessage ? i18n.t(defaultMessage) : i18n.t('Errors.default_error');
  if (e) {
    if (e.error && e.error.message) {
      const key = `Errors['${e.error.message}']`;
      if (i18n.te(key)) {
        errorMessage = i18n.t(key);
      } else {
        // if translation key does not exists, fallback on initial message string
        errorMessage = e.error.message;
      }
      if (errorMessage) return errorMessage;
    } else if (e.error && e.error.data && e.error.data[Object.keys(e.error.data)[0]]) {
      errorMessage = e.error.data[Object.keys(e.error.data)[0]];
      if (errorMessage) return errorMessage;
    }
  }
  return errorMessage;
}
