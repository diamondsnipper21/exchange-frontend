<template>
  <v-layout row align-center>
    <v-flex xs2 sm1>
      <vue-tel-input
        @onInput="onSelectCountryCode"
        :preferredCountries="['us', 'gb', 'ua']"
        defaultCountry="US"
      ></vue-tel-input>
    </v-flex>
    <v-flex xs10 sm11>
      <v-text-field
        :label="$t('IntTelInput.phone_number_label')"
        required
        mask="##########"
        :placeholder="$t('IntTelInput.phone_number_placeholder')"
        color='teal lighten-2'
        v-model='phoneNumber'
        type='tel'
        return-masked-value
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
/**
 * =============
 * Phone number input component
 * =============
 *
 * Renders country select dropdown and input field
 * https://github.com/EducationLink/vue-tel-input
 */
export default {
  name: 'phone-number-input',
  data() {
    return {
      phoneCode: '1',
      phoneNumber: '',
    };
  },
  methods: {
    /**
     * Changes country calling code
     * @param {Object} data phone-input data
     */
    onSelectCountryCode(data) {
      this.phoneCode = `${data.country.dialCode}`;
      this.emitNumberInput();
    },

    /**
     * Emits event with updated phone number
     */
    emitNumberInput() {
      const number = `+${this.phoneCode}${this.phoneNumber}`;
      this.$emit('phone-input', number);
    },

    /**
     * Removes 0 from the beginning of phone number string
     * @param {String} number entered phone number
     */
    formatPhoneNumber(number) {
      if (number.startsWith('0')) {
        this.$nextTick(() => {
          this.phoneNumber = number.slice(1);
        });
      }
    },
  },
  watch: {
    /**
     * Validates updated phone number and emits the event
     * @param {String} next updated phone number string
     */
    phoneNumber(next) {
      this.formatPhoneNumber(next);
      this.emitNumberInput();
    },
  },
};
</script>

<style lang="scss">
.vue-tel-input {
  border: 0 !important;
  
  &:focus-within {
    box-shadow: none !important;
  }

  & .dropdown {
    padding-left: 0 !important;
    padding-right: 0 !important;
    background-color: transparent !important;

    & ul {
      z-index: 3;
    }
  }

  & .selection {
    display: flex !important;
    justify-content: space-between !important;
  }

  & .iti-flag {
    margin-left: 0 !important;
  }

  & input {
    display: none !important;
  }
}
</style>
