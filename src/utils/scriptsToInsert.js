/* ============
 * Scripts to insert
 * ============
 *
 * Analytics & Hotjar scripts
 */

/* eslint-disable */
export default {
  sb: () => '<script type="text/javascript">' +
    'window.__lo_site_id = 122961;' +
    '(function() {' +
    'var wa = document.createElement("script"); wa.type = "text/javascript"; wa.async = true;' +
    'wa.src = "https://d10lpsik1i8c69.cloudfront.net/w.js";' +
    'var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(wa, s);' +
    '})();<' +
    '/script>',
  // ANALYTICS GLOBAL (ALL CC EXCHANGES)
  gacc: themeAnalyticsGlobal => '<script async src="https://www.googletagmanager.com/gtag/js?id=' + themeAnalyticsGlobal + '"><' +
    '/script>' +
    '<script> window.dataLayer = window.dataLayer || [];' +
    'function gtag(){dataLayer.push(arguments);}' +
    'gtag("js", new Date());' +
    'gtag("config", "' + themeAnalyticsGlobal + '");<' +
    '/script>',
  // ANALYTICS CLIENT / PARTNER (ALL CC EXCHANGES)
  ga: themeAnalyticsClient => '<script async src="https://www.googletagmanager.com/gtag/js?id=' + themeAnalyticsClient + '"><' +
    '/script>' +
    '<script> window.dataLayer = window.dataLayer || [];' +
    'function gtag(){dataLayer.push(arguments);}' +
    'gtag("js", new Date());' +
    'gtag("config", "' + themeAnalyticsClient + '");<' +
    '/script>',
  // HOTJAR CLIENT / PARTNER (ALL CC EXCHANGES)
  hotjar: themeHotjarClient => '<script>' +
    '(function(h,o,t,j,a,r){' +
    'h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};' +
    'h._hjSettings={hjid:' + themeHotjarClient + ',hjsv:6};' +
    'a=o.getElementsByTagName(\'head\')[0];' +
    'r=o.createElement(\'script\');r.async=1;' +
    'r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;' +
    'a.appendChild(r);' +
    '})(window,document,"https://static.hotjar.com/c/hotjar-",".js?sv=");<' +
    '/script>',
};
/* eslint-enable */
