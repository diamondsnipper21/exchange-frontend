<template>
  <div>
    <div style="white-space: nowrap;">{{ dateFirstPart }}</div>
    <div style="white-space: nowrap;">{{ dateSecondPart }}</div>
  </div>
</template>

<script>
import convert from '@/directives/date';

export default {
  name: 'table-date-cell',
  props: {
    date: {
      type: [Number, String],
    },
  },
  computed: {
    convertedDate() {
      return convert(this.date) || '';
    },
    dateFirstPart() {
      return this.convertedDate.split(' ')[0] || '';
    },
    dateSecondPart() {
      return this.convertedDate.split(' ')[1] || '';
    },
  },
};
</script>
