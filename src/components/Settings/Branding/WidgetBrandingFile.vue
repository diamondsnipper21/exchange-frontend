<template>
  <v-layout v-bind:class="{'pb-4': !isFavicon }" style="display:block">
    <div class="pb-4" v-if=!isFavicon>
        <h3><span style="border-bottom:1px solid; padding-bottom:2px;">{{ title }}</span></h3>
    </div>
    <div v-bind:class="{'img-logo-container' : !isFavicon, 'img-favicon-container' : isFavicon,
      'bg-cc': selectedIndex == constVar.SELECT_INDEX_FILE_DARK,
      'bg-cc-mobile': selectedIndex == constVar.SELECT_INDEX_FILE_MOBILE_DARK}"
    >
        <img :src=logoUrlAccount v-if="!logoUrlAccountPrev && !logoUrlAccountDelete"/>
        <img :src="logoUrlAccountPrev" v-if="logoUrlAccountPrev && !logoUrlAccountDelete"/>
    </div>
    <div class="pb-1">
        <span class="cce-admin_panel-a-link" @click="showChangeModal()">{{ $t('AdminManageSetting.link_change') }}</span>
        <span> | </span>
        <span class="cce-admin_panel-a-link" @click="showDeleteModal()">{{ $t('AdminManageSetting.link_delete') }}</span>
    </div>
    <div class="pb-4">
        <span>{{ $t('AdminManageSetting.logo_desc') }}<br/></span>
        <span v-if="selectedIndex == constVar.SELECT_INDEX_FILE_MOBILE_DARK || selectedIndex === constVar.SELECT_INDEX_FILE_MOBILE_LIGHT">{{ $t('AdminManageSetting.logo_mobile_size') }}</span>
        <span v-if="selectedIndex == constVar.SELECT_INDEX_FILE_DARK || selectedIndex == constVar.SELECT_INDEX_FILE_LIGHT">{{ $t('AdminManageSetting.logo_desktop_size') }}</span>
    </div>
    <input type="file" :id="fileId" @change="handleFileChange" hidden/>
    <template>
      <widget-modal
        :title="$t('AdminManageSetting.modal_change_file_title')"
        :message="$t('AdminManageSetting.modal_change_file_message')"
        v-if="isChangeModalVisible"
        @onClose="isChangeModalVisible = !isChangeModalVisible"
        @onConfirm="confirmChange()"
      />
      <widget-modal
        :title="$t('AdminManageSetting.modal_delete_file_title')"
        :message="$t('AdminManageSetting.modal_delete_file_message')"
        v-if="isDeleteModalVisible"
        @onClose="isDeleteModalVisible = !isDeleteModalVisible"
        @onConfirm="confirmDelete()"
      />
    </template>
  </v-layout>
</template>

<script>
import WidgetModal from '@/components/Settings/Branding/WidgetModal';

export default {
  name: 'widget-branding-file',
  components: {
    WidgetModal,
  },
  mounted() {
    if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_DARK) {
      this.title = this.$t('AdminManageSetting.logo_title_dark');
    } else if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_LIGHT) {
      this.title = this.$t('AdminManageSetting.logo_title_light');
    } else if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_MOBILE_DARK) {
      this.title = this.$t('AdminManageSetting.logo_title_mobile_dark');
    } else if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_MOBILE_LIGHT) {
      this.title = this.$t('AdminManageSetting.logo_title_mobile_light');
    } else if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_MOBILE_LIGHT) {
      this.title = this.$t('AdminManageSetting.logo_title_mobile_light');
    } else if (this.selectedIndex === this.constVar.SELECT_INDEX_FILE_FAVICON) {
      this.title = this.$t('AdminManageSetting.logo_title_mobile_light');
    }
  },
  props: {
    logoUrlAccount: {
      type: String,
    },
    selectedIndex: {
      type: Number,
    },
    constVar: {
      type: Object,
    },
    isFavicon: {
      type: Boolean,
    },
  },
  data() {
    return {
      isDeleteModalVisible: false,
      isChangeModalVisible: false,
      title: '',

      logoUrlAccountFile: null,
      logoUrlAccountPrev: '',
      logoUrlAccountDelete: false,
      fileId: `file_${this.selectedIndex}`,
    };
  },
  methods: {
    /**
    * Confirm to delete image(Head Logo / Favicon)
    */
    confirmChange() {
      const elem = document.getElementById(this.fileId);
      if (elem && document.createEvent) {
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        elem.dispatchEvent(evt);
      }
      this.isChangeModalVisible = false;
    },

    /**
    * Show change modal dialog when user click change link(Head Logo / Favicon)
    */
    showChangeModal() {
      this.isChangeModalVisible = true;
    },

    /**
    * Show delete modal dialog when user click delete link(Head Logo / Favicon)
    */
    showDeleteModal() {
      this.isDeleteModalVisible = true;
    },

    /**
    * Confirm to delete image(Head Logo / Favicon)
    */
    confirmDelete() {
      this.logoUrlAccountFile = null;
      this.logoUrlAccountPrev = '';
      this.logoUrlAccountDelete = true;
      this.isDeleteModalVisible = false;
      this.$emit('onUpdate', this.selectedIndex, this.logoUrlAccountFile, this.logoUrlAccountDelete);
    },

    /**
    * Set image file and show prev image when user select file on file dialog
    */
    handleFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const file = files[0];
      if (!file.type.match('image.*')) {
        this.$notify({
          type: 'warn',
          text: 'File type is not image',
        });
        return;
      }

      const reader = new FileReader();
      const that = this;

      this.logoUrlAccountFile = file;
      this.logoUrlAccountDelete = false;

      reader.onload = (eo) => {
        that.logoUrlAccountPrev = eo.target.result;

        this.$emit('onUpdate', this.selectedIndex, this.logoUrlAccountFile, this.logoUrlAccountDelete);
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>
