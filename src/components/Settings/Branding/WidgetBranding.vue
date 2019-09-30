<template>
  <div class="cce-admin__panel">
      <v-progress-linear indeterminate class="cce-admin_panel-progress" height="1" v-if="loading"/>
      <div class="cce-admin_panel-form-row pl-3 pr-3 pt-3">
        <v-layout row wrap>
            <v-flex>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm2>
                        <h3 :class="{'pl-3' : !isMobile }">{{ $t('AdminManageSetting.header_logo') }}</h3>
                    </v-flex>
                    <v-flex sm9 xs12 style="display:block">
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <widget-branding-file
                            :logoUrlAccount="logoUrlAccount"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_FILE_DARK"
                            :constVar="CONST_VAR"
                            @onUpdate="updateFileValue"/>
                        </v-flex>
                        <v-flex>
                          <widget-branding-file
                            :logoUrlAccount="logoUrlAccountLight"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_FILE_LIGHT"
                            :constVar="CONST_VAR"
                            @onUpdate="updateFileValue"/>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="pt-4">
                        <v-flex>
                          <widget-branding-file
                            :logoUrlAccount="logoUrlAccountMobileDark"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_FILE_MOBILE_DARK"
                            :constVar="CONST_VAR"
                            @onUpdate="updateFileValue"/>
                        </v-flex>
                        <v-flex>
                          <widget-branding-file
                            :logoUrlAccount="logoUrlAccountMobileLight"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_FILE_MOBILE_LIGHT"
                            :constVar="CONST_VAR"
                            @onUpdate="updateFileValue"/>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout row style="display:block">
            <v-flex d-flex offset-sm2 sm6>
            <v-layout class="pb-4" style="display:block">
                <div :class="{'pl-4' : !isMobile }">
                    <div class="pb-2">
                        <h3>{{ $t('AdminManageSetting.logo_href') }}</h3>
                    </div>
                    <div class="pb-2">
                        <input
                        class="cce-admin_panel-control-input-text"
                        v-model="logoHref"
                        :style="{'width': !isMobile ? '400px': '100%'}"
                        />
                    </div>
                    <div>
                        <span>{{ $t('AdminManageSetting.url_desc') }}</span>
                    </div>
                </div>
            </v-layout>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="cce-admin_panel_top_border">
            <v-flex>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm2>
                        <h3 :class="{'pl-3': !isMobile }">{{ $t('AdminManageSetting.favicon') }}</h3>
                    </v-flex>
                    <v-flex d-flex xs12 sm9>
                        <widget-branding-file
                        :logoUrlAccount="faviconUrl"
                        :selectedIndex="CONST_VAR.SELECT_INDEX_FILE_FAVICON"
                        :constVar="CONST_VAR"
                        :isFavicon=true
                        @onUpdate="updateFileValue"/>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="cce-admin_panel_top_border">
            <v-flex>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm2>
                      <h3 :class="{'pl-3': !isMobile }">{{ $t('AdminManageSetting.colors_dark_theme') }}</h3>
                    </v-flex>
                    <v-flex d-flex xs12 sm3>
                        <v-layout class="pb-2" style="display:block">
                          <v-flex xs12>
                            <widget-branding-color
                            :inputColor.sync="darkBrandColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_DARK_BRAND"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="darkPageBackgroundColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_DARK_PAGE_BG"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="darkContainerBackgroundColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_DARK_CONTAINER_BG"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="darkBuyColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_DARK_BUY"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="darkSellColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_DARK_SELL"
                            @onUpdate="updateValue"/>

                            <v-flex d-flex class="pb-2">
                                <div>
                                    <span>{{ $t('AdminManageSetting.color_desc') }}</span>
                                </div>
                                <v-btn v-if="!isMobile"
                                class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                                @click="showDefaultModal(CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_DARK)"
                                >
                                {{ $t('AdminManageSetting.default_btn') }}
                                </v-btn>
                            </v-flex>
                          </v-flex>
                          <v-flex d-flex xs12  v-if="isMobile">
                            <v-btn
                            class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                            @click="showDefaultModal(CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_DARK)"
                            >
                            {{ $t('AdminManageSetting.default_btn') }}
                            </v-btn>
                          </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex d-flex offset-sm1 sm2>
                        <h3 :class="{'pl-5' : !isMobile}">{{ $t('AdminManageSetting.colors_light_theme') }}</h3>
                    </v-flex>
                    <v-flex d-flex sm3>
                        <v-layout class="pb-2" style="display:block">
                          <v-flex xs12>
                            <widget-branding-color
                            :inputColor.sync="lightBrandColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_LIGHT_BRAND"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="lightPageBackgroundColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_LIGHT_PAGE_BG"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="lightContainerBackgroundColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_LIGHT_CONTAINER_BG"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="lightBuyColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_LIGHT_BUY"
                            @onUpdate="updateValue"/>

                            <widget-branding-color
                            :inputColor.sync="lightSellColor"
                            :selectedIndex="CONST_VAR.SELECT_INDEX_LIGHT_SELL"
                            @onUpdate="updateValue"/>

                            <v-flex d-flex class="pb-2">
                                <div>
                                    <span>{{ $t('AdminManageSetting.color_desc') }}</span>
                                </div>
                                <v-btn v-if="!isMobile"
                                class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                                @click="showDefaultModal(CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_LIGHT)"
                                >
                                {{ $t('AdminManageSetting.default_btn') }}
                                </v-btn>
                            </v-flex>
                            </v-flex>
                            <v-flex d-flex xs12  v-if="isMobile">
                              <v-btn
                                class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                                @click="showDefaultModal(CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_LIGHT)"
                                >
                                {{ $t('AdminManageSetting.default_btn') }}
                              </v-btn>
                          </v-flex>
                        </v-layout>
                    </v-flex>

                </v-layout>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="cce-admin_panel_top_border">
            <v-flex>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm2>
                        <h3 :class="{'pl-3':!isMobile}">{{ $t('AdminManageSetting.host_mapping') }}</h3>
                    </v-flex>
                    <v-flex d-flex xs12 sm9>
                        <v-layout class="pb-4" style="display:block">
                            <div>
                                <div class="pb-1">
                                    <input
                                    class="cce-admin_panel-control-input-text"
                                    v-model="hostMapping"
                                    :readonly="appSetting.hostMappingRequest"
                                    :disabled="appSetting.hostMappingRequest"
                                    :style="{'width': !isMobile ? '400px': '100%'}"
                                    />
                                </div>
                                <div class="pb-3">
                                    <span>{{ $t('AdminManageSetting.host_mapping_desc') }} <a href="/">{{ $t('AdminManageSetting.host_mapping_learn_more') }}</a></span>
                                </div>

                                <div class="pb-1">
                                    <h3>{{ $t('AdminManageSetting.host_mapping_import') }}</h3>
                                </div>
                                <div>
                                    <p>{{ $t('AdminManageSetting.host_mapping_import_desc') }}</p>
                                </div>

                                <div class="pb-1" v-if="appSetting.hostMappingRequest">

                                  <h3 class="subheading"><div><p>{{ $t('AdminManageSetting.host_mapping_instructions') }}</p></div></h3>

                                  <v-alert type="info" v-if="appSetting.hostMappingRequest.status === 'deleting'" :value="true" dark>
                                    Change request is being canceled...
                                  </v-alert>
                                  <div v-else style="display: block">
                                    <v-expansion-panel expand>
                                      <v-expansion-panel-content
                                        v-for="(validation, index) in appSetting.hostMappingRequest.validations"
                                        :key="validation.name"
                                        :value="!validation.state">

                                        <div slot="header">
                                          <v-icon v-if="validation.state === true" color="success" class="mr-3" left>check_circle</v-icon>
                                          <v-icon v-else color="warning" class="mr-3" left>hourglass_empty</v-icon>
                                          {{ $t('AdminManageSetting.host_mapping_validation_name_' + validation.name) }}
                                        </div>
                                        <v-card>
                                          <v-card-text class="grey lighten-3">

                                            <p class="body-2">
                                              {{ $t('AdminManageSetting.host_mapping_validation_desc_' + validation.name) }}
                                            <p/>

                                            <div v-if="validation.dnsRecord">
                                              <p class="body-1">
                                                {{ $t('AdminManageSetting.host_mapping_dns_instructions') }}
                                              </p>
                                              <v-layout row wrap>

                                                <v-flex xs12>
                                                  <v-text-field
                                                    :value="validation.dnsRecord.name"
                                                    label="Name"
                                                    append-icon="content_copy"
                                                    :append-icon-cb="() => copyToClipboard(validation.name + '-name')"
                                                    :id="validation.name + '-name'"
                                                    readonly
                                                  ></v-text-field>
                                                </v-flex>

                                                <v-flex xs3>
                                                  <v-text-field
                                                    :value="validation.dnsRecord.type"
                                                    label="Type"
                                                    readonly
                                                  ></v-text-field>
                                                </v-flex>

                                                <v-flex xs12>
                                                  <v-text-field
                                                    :value="validation.dnsRecord.value"
                                                    label="Value"
                                                    append-icon="content_copy"
                                                    :append-icon-cb="() => copyToClipboard(validation.name + '-value')"
                                                    :id="validation.name + '-value'"
                                                    readonly
                                                  ></v-text-field>
                                                </v-flex>

                                              </v-layout>

                                            </div>

                                          </v-card-text>
                                        </v-card>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>

                                    <p class="body-1 mt-3">
                                      {{ $t('AdminManageSetting.host_mapping_validation_instructions') }}
                                    </p>

                                    <v-btn text @click="cancelHostMapping()">
                                      {{ $t('AdminManageSetting.host_mapping_cancel') }}
                                    </v-btn>

                                  </div>
                                </div>

                            </div>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout class="pb-3 cce-admin_panel-save-row" row>
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
          :title="$t('AdminManageSetting.modal_save_title')"
          :message="$t('AdminManageSetting.modal_save_message')"
          v-if="isSaveModalVisible"
          @onClose="isSaveModalVisible = !isSaveModalVisible"
          @onConfirm="saveSetting()"
        />
        <widget-modal
          :title="$t('AdminManageSetting.modal_delete_file_title')"
          :message="$t('AdminManageSetting.modal_delete_file_message')"
          v-if="isDeleteModalVisible"
          @onClose="isDeleteModalVisible = !isDeleteModalVisible"
          @onConfirm="confirmDelete()"
        />
        <widget-modal
          :title="$t('AdminManageSetting.modal_change_file_title')"
          :message="$t('AdminManageSetting.modal_change_file_message')"
          v-if="isChangeModalVisible"
          @onClose="isChangeModalVisible = !isChangeModalVisible"
          @onConfirm="confirmChange()"
        />
        <widget-modal
          :title="$t('AdminManageSetting.modal_set_default_title')"
          :message="$t('AdminManageSetting.modal_set_default_message')"
          v-if="isDefaultModalVisible"
          @onClose="isDefaultModalVisible = !isDefaultModalVisible"
          @onConfirm="confirmDefault()"
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
  import WidgetBrandingColor from '@/components/Settings/Branding/WidgetBrandingColor';
  import WidgetBrandingFile from '@/components/Settings/Branding/WidgetBrandingFile';
  import ProjectProxy from '@/proxies/ProjectProxy';
  // import Vue from 'vue';

  const DEFAULT_BRANDING_COLOR = '#121626';
  const DEFAULT_PAGE_BACKGROUND_COLOR = '#222836';
  const DEFAULT_CONTAINER_BACKGROUND_COLOR = '#161b2e';
  const DEFAULT_BUY_COLOR = '#0da19c';
  const DEFAULT_SELL_COLOR = '#dd842e';

  const DEFAULT_LIGHT_BRANDING_COLOR = '#ebebeb';
  const DEFAULT_LIGHT_PAGE_BACKGROUND_COLOR = '#f5f5f5';
  const DEFAULT_LIGHT_CONTAINER_BACKGROUND_COLOR = '#ffffff';
  const DEFAULT_LIGHT_BUY_COLOR = '#0da19c';
  const DEFAULT_LIGHT_SELL_COLOR = '#dd842e';

  const CONST_VAR = {
    SELECT_INDEX_DARK_BRAND: 1,
    SELECT_INDEX_DARK_PAGE_BG: 2,
    SELECT_INDEX_DARK_CONTAINER_BG: 3,
    SELECT_INDEX_DARK_BUY: 4,
    SELECT_INDEX_DARK_SELL: 5,
    SELECT_INDEX_LIGHT_BRAND: 6,
    SELECT_INDEX_LIGHT_PAGE_BG: 7,
    SELECT_INDEX_LIGHT_CONTAINER_BG: 8,
    SELECT_INDEX_LIGHT_BUY: 9,
    SELECT_INDEX_LIGHT_SELL: 10,

    SELECT_INDEX_FILE_DARK: 11,
    SELECT_INDEX_FILE_LIGHT: 12,
    SELECT_INDEX_FILE_MOBILE_DARK: 13,
    SELECT_INDEX_FILE_MOBILE_LIGHT: 14,
    SELECT_INDEX_FILE_FAVICON: 15,

    SELECT_INDEX_DEFAULT_TYPE_DARK: 100,
    SELECT_INDEX_DEFAULT_TYPE_LIGHT: 101,
  };

  export default {
    name: 'widget-branding',
    components: {
      WidgetModal,
      WidgetBrandingColor,
      WidgetBrandingFile,
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        logoHref: '',
        darkBrandColor: DEFAULT_BRANDING_COLOR,
        darkPageBackgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
        darkContainerBackgroundColor: DEFAULT_CONTAINER_BACKGROUND_COLOR,
        darkBuyColor: DEFAULT_BUY_COLOR,
        darkSellColor: DEFAULT_SELL_COLOR,

        lightBrandColor: DEFAULT_LIGHT_BRANDING_COLOR,
        lightPageBackgroundColor: DEFAULT_LIGHT_PAGE_BACKGROUND_COLOR,
        lightContainerBackgroundColor: DEFAULT_LIGHT_CONTAINER_BACKGROUND_COLOR,
        lightBuyColor: DEFAULT_LIGHT_BUY_COLOR,
        lightSellColor: DEFAULT_LIGHT_SELL_COLOR,

        hostMapping: '',

        logoUrlAccountFile: null,
        logoUrlAccountLightFile: null,
        logoUrlAccountMobileDarkFile: null,
        logoUrlAccountMobileLightFile: null,

        logoUrlAccount: '',
        logoUrlAccountLight: '',
        logoUrlAccountMobileDark: '',
        logoUrlAccountMobileLight: '',

        logoUrlAccountDelete: false,
        logoUrlAccountLightDelete: false,
        logoUrlAccountMobileDarkDelete: false,
        logoUrlAccountMobileLightDelete: false,

        faviconUrl: '',
        faviconUrlFile: null,
        faviconUrlDelete: false,

        isDefaultModalVisible: false,
        selectDefaultType: 0,

        isDeleteModalVisible: false,
        isChangeModalVisible: false,
        isSaveModalVisible: false,
        loading: false,

        CONST_VAR,
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
        this.logoHref = setting.themeSettings.logoHref;

        this.logoUrlAccount = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccount}?rnd=${Math.random()}`;
        this.logoUrlAccountLight = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountLight}?rnd=${Math.random()}`;
        this.logoUrlAccountMobileDark = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountMobileDark}?rnd=${Math.random()}`;
        this.logoUrlAccountMobileLight = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountMobileLight}?rnd=${Math.random()}`;

        if (setting.themeSettings.logoUrlAccountDelete) {
          this.logoUrlAccountDelete = setting.themeSettings.logoUrlAccountDelete;
        }

        if (setting.themeSettings.logoUrlAccountLightDelete) {
          this.logoUrlAccountLightDelete = setting.themeSettings.logoUrlAccountLightDelete;
        }

        if (setting.themeSettings.logoUrlAccountMobileDarkDelete) {
          this.logoUrlAccountMobileDarkDelete = setting.themeSettings.logoUrlAccountMobileDarkDelete;
        }

        if (setting.themeSettings.logoUrlAccountMobileLightDelete) {
          this.logoUrlAccountMobileLightDelete =
            setting.themeSettings.logoUrlAccountMobileLightDelete;
        }

        this.faviconUrl = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.faviconUrl}?rnd=${Math.random()}`;
        if (setting.themeSettings.faviconUrlDelete) {
          this.faviconUrlDelete = setting.themeSettings.faviconUrlDelete;
        }

        this.darkBrandColor = setting.themeSettings.darkBrandColor || DEFAULT_BRANDING_COLOR;
        this.darkPageBackgroundColor = setting.themeSettings.darkPageBackgroundColor
          || DEFAULT_PAGE_BACKGROUND_COLOR;
        this.darkContainerBackgroundColor = setting.themeSettings.darkContainerBackgroundColor
          || DEFAULT_CONTAINER_BACKGROUND_COLOR;
        this.darkBuyColor = setting.themeSettings.darkBuyColor || DEFAULT_BUY_COLOR;
        this.darkSellColor = setting.themeSettings.darkSellColor || DEFAULT_SELL_COLOR;

        this.lightBrandColor = setting.themeSettings.lightBrandColor || DEFAULT_LIGHT_BRANDING_COLOR;
        this.lightPageBackgroundColor = setting.themeSettings.lightPageBackgroundColor
          || DEFAULT_LIGHT_PAGE_BACKGROUND_COLOR;
        this.lightContainerBackgroundColor = setting.themeSettings.lightContainerBackgroundColor
          || DEFAULT_LIGHT_CONTAINER_BACKGROUND_COLOR;
        this.lightBuyColor = setting.themeSettings.lightBuyColor || DEFAULT_LIGHT_BUY_COLOR;
        this.lightSellColor = setting.themeSettings.lightSellColor || DEFAULT_LIGHT_SELL_COLOR;
        if (setting.domain) {
          this.hostMapping = setting.domain;
        }
        if (this.appSetting && this.appSetting.hostMappingRequest) {
          this.hostMapping = this.appSetting.hostMappingRequest.newDomain;
        }
        this.loading = false;
        // Set Theme with setting color
        this.setSettingToPartner(setting, this.themeMode);
      },

      async cancelHostMapping() {
        try {
          this.loading = true;
          this.isSaveModalVisible = false;
          await new ProjectProxy().cancelHostMapping().then(async (res) => {
            const pSetting = res.result.project;
            await this.$store.dispatch('app/setAppSetting', pSetting);
            await this.init();
          });
          this.$notify({
            type: 'success',
            text: this.$t('AdminManageSetting.save_complete_message'),
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
      async saveSetting() {
        try {
          this.loading = true;
          this.isSaveModalVisible = false;

          const formData = new FormData();
          formData.append('darkBrandColor', this.darkBrandColor);
          formData.append('darkPageBackgroundColor', this.darkPageBackgroundColor);
          formData.append('darkContainerBackgroundColor', this.darkContainerBackgroundColor);
          formData.append('darkBuyColor', this.darkBuyColor);
          formData.append('darkSellColor', this.darkSellColor);

          formData.append('lightBrandColor', this.lightBrandColor);
          formData.append('lightPageBackgroundColor', this.lightPageBackgroundColor);
          formData.append('lightContainerBackgroundColor', this.lightContainerBackgroundColor);
          formData.append('lightBuyColor', this.lightBuyColor);
          formData.append('lightSellColor', this.lightSellColor);

          formData.append('logoHref', this.logoHref);
          formData.append('hostMapping', this.hostMapping);
          formData.append('logoUrlAccountDelete', this.logoUrlAccountDelete);
          formData.append('logoUrlAccountLightDelete', this.logoUrlAccountLightDelete);
          formData.append('logoUrlAccountMobileDarkDelete', this.logoUrlAccountMobileDarkDelete);
          formData.append('logoUrlAccountMobileLightDelete', this.logoUrlAccountMobileLightDelete);
          formData.append('faviconUrlDelete', this.faviconUrlDelete);

          if (this.logoUrlAccountFile) {
            formData.append('logoUrlAccountFile', this.logoUrlAccountFile, this.logoUrlAccountFile.name);
          }

          if (this.logoUrlAccountLightFile) {
            formData.append('logoUrlAccountLightFile', this.logoUrlAccountLightFile, this.logoUrlAccountLightFile.name);
          }

          if (this.logoUrlAccountMobileDarkFile) {
            formData.append('logoUrlAccountMobileDarkFile', this.logoUrlAccountMobileDarkFile, this.logoUrlAccountMobileDarkFile.name);
          }

          if (this.logoUrlAccountMobileLightFile) {
            formData.append('logoUrlAccountMobileLightFile', this.logoUrlAccountMobileLightFile, this.logoUrlAccountMobileLightFile.name);
          }

          if (this.faviconUrlFile) {
            formData.append('faviconUrlFile', this.faviconUrlFile, this.faviconUrlFile.name);
          }

          await new ProjectProxy().updateSetting(formData).then(async (res) => {
            const pSetting = res.result.project;
            await this.$store.dispatch('app/setAppSetting', pSetting);
            await this.init();
          });
          this.$notify({
            type: 'success',
            text: this.$t('AdminManageSetting.save_complete_message'),
          });
          console.log(formData);
          this.loading = false;
        } catch (err) {
          this.loading = false;
          this.$notify({
            type: 'warn',
            text: (err.error && err.error.code) || err,
          });
        }
      },

      showDefaultModal(defaultType) {
        if (this.loading) {
          return;
        }
        this.selectDefaultType = defaultType;
        this.isDefaultModalVisible = true;
      },

      /**
      * Confirm to reset color values as default
      */
      confirmDefault() {
        if (this.selectDefaultType === CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_DARK) {
          this.darkBrandColor = DEFAULT_BRANDING_COLOR;
          this.darkPageBackgroundColor = DEFAULT_PAGE_BACKGROUND_COLOR;
          this.darkContainerBackgroundColor = DEFAULT_CONTAINER_BACKGROUND_COLOR;
          this.darkBuyColor = DEFAULT_BUY_COLOR;
          this.darkSellColor = DEFAULT_SELL_COLOR;
        } else if (this.selectDefaultType === CONST_VAR.SELECT_INDEX_DEFAULT_TYPE_LIGHT) {
          this.lightBrandColor = DEFAULT_LIGHT_BRANDING_COLOR;
          this.lightPageBackgroundColor = DEFAULT_LIGHT_PAGE_BACKGROUND_COLOR;
          this.lightContainerBackgroundColor = DEFAULT_LIGHT_CONTAINER_BACKGROUND_COLOR;
          this.lightBuyColor = DEFAULT_LIGHT_BUY_COLOR;
          this.lightSellColor = DEFAULT_LIGHT_SELL_COLOR;
        }
        this.isDefaultModalVisible = false;
      },

      showModal() {
        if (this.loading) {
          return;
        }
        this.isSaveModalVisible = true;
      },

      /**
      * Set file value when user select file on file dialog
      */
      updateFileValue(selectedIndex, selectedFile, selectedIsDelete) {
        if (selectedIndex === CONST_VAR.SELECT_INDEX_FILE_DARK) {
          this.logoUrlAccountFile = selectedFile;
          this.logoUrlAccountDelete = selectedIsDelete;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_FILE_LIGHT) {
          this.logoUrlAccountLightFile = selectedFile;
          this.logoUrlAccountLightDelete = selectedIsDelete;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_FILE_MOBILE_DARK) {
          this.logoUrlAccountMobileDarkFile = selectedFile;
          this.logoUrlAccountMobileDarkDelete = selectedIsDelete;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_FILE_MOBILE_LIGHT) {
          this.logoUrlAccountMobileLightFile = selectedFile;
          this.logoUrlAccountMobileLightDelete = selectedIsDelete;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_FILE_FAVICON) {
          this.faviconUrlFile = selectedFile;
          this.faviconUrlDelete = selectedIsDelete;
        }
      },

      /**
      * Set color value when user select color on Color Picker Dialog
      */
      updateValue(selectedIndex, colorValue) {
        if (selectedIndex === CONST_VAR.SELECT_INDEX_DARK_BRAND) {
          this.darkBrandColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_DARK_PAGE_BG) {
          this.darkPageBackgroundColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_DARK_CONTAINER_BG) {
          this.darkContainerBackgroundColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_DARK_BUY) {
          this.darkBuyColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_DARK_SELL) {
          this.darkSellColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_LIGHT_BRAND) {
          this.lightBrandColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_LIGHT_PAGE_BG) {
          this.lightPageBackgroundColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_LIGHT_CONTAINER_BG) {
          this.lightContainerBackgroundColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_LIGHT_BUY) {
          this.lightBuyColor = colorValue;
        } else if (selectedIndex === CONST_VAR.SELECT_INDEX_LIGHT_SELL) {
          this.lightSellColor = colorValue;
        }
      },

      copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        document.execCommand('copy');
      },
    },
  };
</script>
