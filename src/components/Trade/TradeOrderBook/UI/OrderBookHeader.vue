<template>
  <div class="cce-trade__panel-title">
    <div>Order Book</div>
    <div class="cce-trade__orders-groups">
      <v-icon
        small
        :class="{
          'cce-trade__orders-resize-item noselect px-1 py-1' : true,
          'reset-btn-disabled' : decreaseDisabled,
        }"
        @click="decreasePrecision"
        title="Decrease precision"
      >
        remove
      </v-icon>
      <v-icon
        small
        :class="{
          'cce-trade__orders-resize-item noselect px-1 py-1' : true,
          'reset-btn-disabled' : increaseDisabled,
        }"
        @click="increasePrecision"
        title="Increase precision"
      >
        add
      </v-icon>
    </div>
    <div class="cce-trade__orders-resize">
      <v-icon
        small
        :class="{
          'cce-trade__orders-resize-item noselect px-1 py-1': true,
          'reset-btn-disabled': !isResetScrollBtnActive,
        }"
        @click="restoreScroll"
        title="Center all"
      >
        vertical_align_center
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-book-header',
  props: {
    decreaseDisabled: { type: Boolean },
    increaseDisabled: { type: Boolean },
    isResetScrollBtnActive: { type: Boolean },
  },
  methods: {
    decreasePrecision() {
      this.$emit('decrease');
    },
    increasePrecision() {
      this.$emit('increase');
    },
    restoreScroll() {
      this.$emit('restoreScroll');
    },
  },
};
</script>
