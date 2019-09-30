<template>
  <div class="cce-trade__trade-form-control">
    <input
      class="cce-trade__trade-form-control-input"
      :class="{ 'cce-trade__trade-form-control-input--error': hasError }"
      ref="input"
      :value="value"
      @input="updateValue($event.target.value)"
      @blur="blur"
      @focus="focus"
    />
    <div
      class="cce-trade__trade-form-control-currency"
      v-if="symbol"
    >
      <span class="cce-uppercase">
        {{ symbol }}
      </span>
    </div>
    <div class="cce-trade__trade-form-control-arrows">
      <div class="cce-trade__trade-form-control-arrows-up">
        <v-icon
          small
          class="cce-trade__trade-form-control-arrows-up-inner"
          @click.prevent="increase"
        >
          arrow_drop_up
        </v-icon>
      </div>
      <div class="cce-trade__trade-form-control-arrows-down">
        <v-icon
          small
          class="cce-trade__trade-form-control-arrows-down-inner"
          @click.prevent="decrease"
        >
          arrow_drop_down
        </v-icon>
      </div>
    </div>
    <div
      class="cce-trade__trade-form-control--disabled"
      v-if="disabled"
    ></div>
  </div>
</template>

<script>
  /* ============
   * Form input
   * ============
   *
   * Input component to enter price/amount for the trade section form
   */

  import Big from 'big.js';

  export default {
    name: 'trade-form-input',
    props: {
      value: {
        default: 0,
      },
      precision: {
        type: Number,
        default: 8,
      },
      symbol: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      hasError: {
        type: Boolean,
        default: false,
      },
      onBlur: {
        type: Function,
        default: null,
        required: false,
      },
      onInput: {
        type: Function,
        default: null,
        required: false,
      },
    },
    data() {
      return {
        focused: false,
      };
    },
    methods: {
      updateValue(value) {
        if (this.disabled) {
          return;
        }
        value = value.toString().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        value = value === '.' ? '' : value;
        if (value !== this.$refs.input.value) {
          this.$refs.input.value = value;
        }
        this.$emit('input', value);
        if (this.onInput) {
          this.onInput();
        }
      },
      format() {
        if (this.disabled) {
          return;
        }
        let val = this.$refs.input.value.toString();
        if (val === '') {
          return;
        }
        val = val < 0 ? 0 : val;
        val = new Big(parseFloat(val)).toFixed(this.precision);
        this.$refs.input.value = val;
        this.$emit('input', val);
      },
      increase() {
        let val = this.$refs.input.value;
        if (val === '') {
          return;
        }
        val = val < 0 ? 0 : val;
        val = new Big(parseFloat(val) + 0.1).toFixed(this.precision);
        this.$refs.input.value = val;
        this.$emit('input', val);
      },
      decrease() {
        let val = this.$refs.input.value;
        if (val === '') {
          return;
        }
        val = val < 0 ? 0 : val;
        val = new Big(parseFloat(val) - 0.1).toFixed(this.precision);
        val = val < 0 ? 0 : val;
        this.$refs.input.value = val;
        this.$emit('input', val);
      },
      focus() {
        this.focused = true;
        this.format();
      },
      blur() {
        this.focused = false;
        this.format();
        if (this.onBlur) {
          this.onBlur();
        }
      },
    },
    watch: {
      value() {
        setTimeout(() => {
          if (!this.focused) {
            this.format();
          }
        }, 1);
      },
    },
  };
</script>
