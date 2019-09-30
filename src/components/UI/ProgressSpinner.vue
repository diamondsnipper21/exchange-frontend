<template>
    <div
      :class="{ 'cce-overlay__content': !noOverlay }"
      :style="customStyle"
    >
      <v-progress-circular
        indeterminate
        :size="70"
        :width="width"
        :color="color"
      />
    </div>
</template>

<script>
export default {
  name: 'progress-spinner',
  props: {
    noOverlay: {
      type: Boolean,
      default: false,
    },
    customStyle: {
      type: Object,
      required: false,
    },
    color: {
      type: String,
      default: '#9baed3',
    },
    width: {
      type: Number,
      default: 1,
    },
  },
};
</script>
