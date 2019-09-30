<template>
  <div class="cce-trade__table-header table-header">
    <div class="table-header__column">
      Amount <span class="cce-uppercase">{{ currency }}</span>
    </div>
    <div class="table-header__column">
      Price <span class="cce-uppercase">{{ marketType }}</span>
    </div>
    <div class="table-header__column">
      Total <span class="cce-uppercase">{{ marketType }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-book-table-header',
  props: {
    currency: {
      type: String,
    },
    marketType: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  width: 100%;
  color: $dark-trade-colorSubHeaderText;
  font-weight: 400;
  font-size: 13px;

  &__column {
    text-align: right;
    width: 30%;
    padding-right: 13px;

    &:first-child {
      width: 40%;
    }
  }
}
</style>
