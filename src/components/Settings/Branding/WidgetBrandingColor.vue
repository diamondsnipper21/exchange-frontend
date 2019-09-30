<template>
  <v-flex d-flex class="pb-2">
    <div class="cce-admin_panel-control-color-title">
      <h3>{{ title }}</h3>
    </div>
    <div class="cce-admin_panel-control-color-input" ref="colorpicker">
      <input
      class="cce-admin_panel-control-input-text"
      :value="inputColor"
      @focus="showPicker"
      />
      <Chrome
      :value="inputColor"
      @input="updateValue"
      v-if="brand_color_visible"
      class="cce-admin_panel-color-panel"
      />
      <div class="cce-admin_panel-color-preview" @click="showPicker" v-bind:style="{'background-color': inputColor, 'border-color': invertColor(inputColor)}"></div>
    </div>
  </v-flex>
</template>

<script>
import { Chrome } from 'vue-color';
import invert from 'invert-color';

export default {
  name: 'widget-branding-color',
  components: {
    Chrome,
  },
  mounted() {
    if (this.selectedIndex % 5 === 1) {
      this.title = this.$t('AdminManageSetting.colors_brand');
    } else if (this.selectedIndex % 5 === 2) {
      this.title = this.$t('AdminManageSetting.colors_page_background');
    } else if (this.selectedIndex % 5 === 3) {
      this.title = this.$t('AdminManageSetting.colors_container_background');
    } else if (this.selectedIndex % 5 === 4) {
      this.title = this.$t('AdminManageSetting.colors_buy');
    } else if (this.selectedIndex % 5 === 0) {
      this.title = this.$t('AdminManageSetting.colors_sell');
    }
  },
  props: {
    inputColor: {
      type: String,
    },
    selectedIndex: {
      type: Number,
    },
  },
  data() {
    return {
      brand_color_visible: false,
      title: '',
    };
  },
  methods: {
    showPicker() {
      document.addEventListener('click', this.documentClick);
      this.brand_color_visible = true;
    },

    hidePicker() {
      document.removeEventListener('click', this.documentClick);
      this.brand_color_visible = false;
    },

    updateValue(val) {
      this.$emit('onUpdate', this.selectedIndex, val.hex);
    },

    documentClick(e) {
      const el = this.$refs.colorpicker;
      const target = e.target;
      if (el) {
        if (el !== target && !el.contains(target)) {
          this.hidePicker();
        }
      }
    },

    invertColor(v) {
      return invert(v);
    },
  },
};
</script>
