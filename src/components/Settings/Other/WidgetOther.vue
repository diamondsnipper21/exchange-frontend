<template>
  <div class="cce-admin__panel">
      <v-progress-linear indeterminate class="cce-admin_panel-progress" height="1" v-if="loading"/>
      <div class="cce-admin_panel-form-row pl-3 pr-3 pt-3">
        <v-layout row class="pb-4">
          <h3>{{ $t('AdminManageSetting.Other.title') }}</h3>
        </v-layout>
        <v-layout row class="pb-2"
          v-for="(item, index) in navStaticPages"
          :key="index"
        >
            <div :class="{'pl-4' : !isMobile, 'd-flex': true}">
                <v-flex class="h3_width">
                    <h3>{{item.name}}</h3>
                </v-flex>
                <v-flex class="pl-4">
                    <input
                    class="cce-admin_panel-control-input-text"
                    v-model="item.href"
                    :style="{'width': !isMobile ? '600px': '100%'}"
                    />
                </v-flex>
            </div>
        </v-layout>
        <v-layout class="pb-3 cce-admin_panel-save-row cce-admin_panel_top_border" row>
            <v-flex d-flex sm3>
                <v-btn class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                @click="showModal()"
                >
                {{ $t('AdminManageSetting.save_btn') }}
                </v-btn>
            </v-flex>
        </v-layout>
      </div>
      <template>
        <widget-modal
          :title="$t('AdminManageSetting.Other.modal_save_title')"
          :message="$t('AdminManageSetting.Other.modal_save_message')"
          v-if="isSaveModalVisible"
          @onClose="isSaveModalVisible = !isSaveModalVisible"
          @onConfirm="saveSetting()"
        />
      </template>
    <v-progress-linear indeterminate class="cce-admin_panel-progress" height="1" v-if="loading"/>
  </div>
</template>

<script>
  /* ============
   * Branding page
   * ============
   *
   * Branding page for the account admin portal section
   */
  import WidgetModal from '@/components/Settings/Branding/WidgetModal';
  import ProjectProxy from '@/proxies/ProjectProxy';
  // import Vue from 'vue';

  
  export default {
    name: 'widget-other',
    components: {
      WidgetModal,
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        urlSupport: '',
        urlTerms: '',
        urlFees: '',
        loading: false,
        isSaveModalVisible: false,
        navStaticPages: [],
      };
    },
    computed: {
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      /**
      * Get project settings
      */
      appSetting() {
        return this.$store.getters['app/getAppSetting'];
      },
      /**
      * Returns if the window width is less than 960px
      * @returns {Boolean}
      */
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
    methods: {
      init() {
        const setting = this.appSetting;
        if (!('themeSettings' in setting)) {
          setTimeout(() => {
            this.init();
          }, 1000);
          return;
        }

        this.loading = true;
        this.navStaticPages = [];
        if (setting && setting.themeSettings && setting.themeSettings.navStaticPages) {
          this.navStaticPages = JSON.parse(JSON.stringify(setting.themeSettings.navStaticPages));
        }
        this.loading = false;
      },

      async saveSetting() {
        try {
          this.loading = true;
          this.isSaveModalVisible = false;

          const formData = new FormData();
          formData.append('navStaticPages', JSON.stringify(this.navStaticPages));

          await new ProjectProxy().updateSetting(formData).then(async (res) => {
            const pSetting = res.result.project;
            await this.$store.dispatch('app/setAppSetting', pSetting);
            await this.init();
          });

          this.$notify({
            type: 'success',
            text: this.$t('AdminManageSetting.Other.save_complete_message'),
          });
          this.loading = false;
        } catch (err) {
          this.loading = false;
          this.$notify({
            type: 'warn',
            text: (err.error && err.error.code) || err,
          });
        }
      },

      showModal() {
        if (this.loading) {
          return;
        }
        this.isSaveModalVisible = true;
      },
    },
  };
</script>

<style scoped>
.h3_width {
  width: 150px;
}
</style>