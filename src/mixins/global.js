import Vue from 'vue';
import Big from 'big.js';

Vue.mixin({
  data() {
    return {
      periods: {
        '1D': 86400000,        // 24 hours in milliseconds
        '1W': 604800000,       // 1 week in milliseconds
        '1M': 2592000000,      // 30 days in milliseconds
        '1Y': 31536000000,     // 365 days in milliseconds
      },
    };
  },
  methods: {
    /**
     * Converts timestamp to date
     *
     * @param {Integer} timestamp The js timestamp
     *
     * @returns {String} Formatted date
     */
    toDate(timestamp) {
      const date = new Date(timestamp);
      const month = `0${date.getMonth() + 1}`.substr(-2);
      const day = `0${date.getDate() + 1}`.substr(-2);
      const hours = `0${date.getHours() + 1}`.substr(-2);
      const minutes = `0${date.getMinutes() + 1}`.substr(-2);
      const seconds = `0${date.getSeconds() + 1}`.substr(-2);
      return `${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    /**
     * Gets icon url for the coin
     *
     * @param {String} currency The coin abbreviation
     *
     * @returns {String} Image Url
     */
    iconUrl(currency) {
      if (currency === undefined) {
        return '';
      }
      return `${process.env.ICONS_LOCATION}32/color/${currency.toLowerCase()}.png`;
    },
    /**
     * Renders a big number with fixed decimals
     *
     * @param {Number} number Number to format
     *
     * @returns {String} Formatted number
     */
    toFixedNumber(number, tDecimal = 6) {
      let decimal = tDecimal;
      if (tDecimal < 6) {
        decimal = parseFloat(number) >= 1 ? 2 : 6;
      }
      return new Big(number).round(decimal, 0).toFixed(decimal);
    },
    /**
     * Multiply number with 10^8 (copy of toBigInt from @cc-dev/math:src/Numbers.js)
     *
     * @param {Number} numFloat Number to format
     *
     * @returns {String} Formatted number
     */
    toBigInt(numFloat) {
      return parseInt(
        new Big(numFloat)
          .times(10 ** 8)
          .round(0, 0)
          .toFixed(),
        10,
      );
    },
    /**
     * Converts given value to stringified percentage value with a sign
     * @param {Number} value given value to convert in percentage
     * @returns {String} converted value with a sign
     */
    addSign(value) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) return '';
      return `${numericValue > 0 ? '+' : ''}${Math.round(numericValue * 100) / 100}%`;
    },
    /**
     * Formats given value by precision
     * @param {Number} value value to process
     * @param {Number} precision value to process by
     * @returns {String} stringified value processed by precision
     */
    processDec(value, precision) {
      if (value >= 1) precision = 2;
      if (precision < 0) precision = 0;
      return new Big(value).toFixed(precision);
    },

    convertToDecimal(val) {
      const decimalPlaces = 6;
      const lastPrice = Number(`${Math.round(parseFloat(`${val}e${decimalPlaces}`))}e-${decimalPlaces}`);
      return lastPrice;
    },
  },
});
