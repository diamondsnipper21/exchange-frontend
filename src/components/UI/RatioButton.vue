<template>
  <v-btn
    small
    depressed
    class="cce-trade__trade-form-volume-btn"
    @click="onClick(value)"
    :disabled="isDisabled"
  >
    {{ value }}%
  </v-btn>
</template>

<script>
export default {
  name: 'ratio-button',
  props: {
    isDisabled: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
    },
  },
  methods: {
    onClick(value) {
      this.$emit('press', value);
    },
  },
};
</script>
