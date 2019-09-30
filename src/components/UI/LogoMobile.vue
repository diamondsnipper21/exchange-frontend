<template>
  <img :src="logoUrl" />
</template>

<script>
export default {
  name: 'logo-mobile',
  computed: {
    /**
     * Returns theme mode
     * @returns {Boolean} true -- dark; false -- light
     */
    themeMode() {
      return this.$store.getters['app/themeMode'];
    },

    /**
     * Returns app name
     * @returns {String}
     */
    themeName() {
      return this.$store.getters['app/themeName'];
    },

    /**
     * Returns image path depending on theme and app
     * @returns {String}
     */
    logoUrl() {
      let logoName;
      if (this.themeMode) {
        logoName = 'logo-exchange-symbol-on-dark';
        return this.chooseLogo(this.themeName, logoName);
      }
      logoName = 'logo-exchange-symbol-on-light';
      return this.chooseLogo(this.themeName, logoName);
    },
  },
  methods: {
    /**
     * Builds image path
     * @param {String} appName given app name
     * @param {String} logoName given logo name
     * @param {String} format image file format
     * @returns {String} concatenated image path
     */
    buildPath(appName, logoName, format = 'svg') {
      return `/static/img/themes/${appName}/${logoName}.${format}`;
    },

    /**
     * Returns logo path depending on app name
     * @param {String} appName given app name
     * @param {String} logo givin logo name
     * @returns {String} app logo path
     */
    chooseLogo(appName, logo) {
      let src = '';
      switch (appName) {
        case 'xbase':
          src = this.buildPath('xbase', logo, 'png');
          break;
        case 'kryptostack':
          src = this.buildPath('kryptostack', logo);
          break;
        case 'traderone':
          src = this.buildPath('traderone', logo);
          break;
        case 'clrquantumx':
          src = this.buildPath('clrquantumx', logo);
          break;
        case 'genblock':
          src = this.buildPath('genblock', logo);
          break;
        default: src = this.buildPath('cce', logo);
      }
      return src;
    },
  },
};
</script>
