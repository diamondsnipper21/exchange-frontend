import Vue from 'vue';
import themeChartDarkVariables from '../assets/sass/charts-dark';
import themeChartLightVariables from '../assets/sass/charts-light';
import getColorSetting from './colorSetting';

Vue.mixin({
  methods: {
    getThemeChartVars() {
      if (Vue.prototype.$themeSettings.themeMode === true) {
        return themeChartDarkVariables;
      }
      return themeChartLightVariables;
    },
    getThemeChartDarkVars() {
      return themeChartDarkVariables;
    },
    getThemeChartLightVars() {
      return themeChartLightVariables;
    },

    setColorToElement(classes, mode, color, style = 'background') {
      // console.log(classes, mode, color, style);
      let retValue = '';
      for (let cInd = 0; cInd < classes.length; cInd += 1) {
        const className = classes[cInd];
        const colorPageBackground = mode ? color[0] : color[1];

        if (/border/.test(style)) {
          retValue += `${className} { ${style}: ${colorPageBackground} !important; } `;
        } else {
          retValue += `${className} { ${style}: ${colorPageBackground} !important; } `;
        }
      }

      return retValue;
    },

    setSettingToPartner(setting, themeMode = true) {
      // console.log('-- theme --', themeMode, setting.themeSettings);

      let link = document.querySelector("link[rel*='icon']");
      const faviconUrl = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.faviconUrl}?rnd=${Math.random()}`;
      if (link) {
        link.href = faviconUrl;
      } else {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      const cSetting = getColorSetting(setting);
      // console.log('~~~~~~~~~~~~~~', cSetting);
      let cssStyleString = '';

      Object.keys(cSetting).forEach((key) => {
        const cSettingObj = cSetting[key];

        cssStyleString += this.setColorToElement(
          cSettingObj.classList,
          themeMode,
          cSettingObj.colorList,
          cSettingObj.style ? cSettingObj.style : 'background',
        );
      });

      const head = document.getElementsByTagName('head')[0];
      const s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      if (s.styleSheet) {   // IE
        s.styleSheet.cssText = cssStyleString;
      } else {                // the world
        s.appendChild(document.createTextNode(cssStyleString));
      }
      head.appendChild(s);
    },

  },
});
