<template>
  <img
    :src="iconPath"
    class="cce-currency-image"
    @error="onError"
  >
</template>

<script>
/**
 * ===============
 * Currency Image component
 * ===============
 *
 * Renders currency logo (or fallback image if the logo doesn't exist)
 */

export default {
  name: 'currency-image',
  props: {
    currency: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fallbackImgPath: './static/img/unknown-currency.png',
    };
  },
  computed: {
    iconPath() {
      if (this.currency) return this.iconUrl(this.currency);
      return this.fallbackImgPath;
    },
  },
  methods: {
    /**
     * Handles image load error and changes src path
     * @param {Object} e event object
     */
    onError(e) {
      e.target.src = this.fallbackImgPath;
    },
  },
};
</script>

<style lang="scss">
.cce-currency-image {
  @include size(15px);
  float: left;
  margin-right: 5px;

  @media (min-width: 500px) {
    @include size(24px);
    margin-right: 10px;
  }
}
</style>
