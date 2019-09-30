/**
 * CSV related methods
 */

export default {
  methods: {
    /**
     * Downloads a file with given mimetype and content
     * @param {String} content text content
     * @param {String} fileName file name
     * @param {String} mimeType mimetype
     */
    downloadFile(content, fileName, mimeType) {
      const aTag = document.createElement('a');
      mimeType = mimeType || 'application/octet-stream';
      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
          type: mimeType,
        }), fileName);
      } else if (URL && 'download' in aTag) { // html5 A[download]
        aTag.href = URL.createObjectURL(new Blob([content], {
          type: mimeType,
        }));
        aTag.setAttribute('download', fileName);
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
      } else {
        location.href = `data:application/octet-stream,${encodeURIComponent(content)}`; // only this mime type is supported
      }
    },

    /**
     * Builds the CSV from given data
     * @param {Array} data array of data to stringify
     * @returns {String} generated CSV string
     */
    buildCSV(data) {
      let ctr;
      const columnDelimiter = ',';
      const lineDelimiter = '\n';
      const keys = Object.keys(data[0]);
      let csvContent = '';

      csvContent += keys.join(columnDelimiter);
      csvContent += lineDelimiter;

      data.forEach((item) => {
        ctr = 0;
        keys.forEach((key) => {
          if (ctr > 0) csvContent += columnDelimiter;
          csvContent += item[key];
          ctr += 1;
        });
        csvContent += lineDelimiter;
      });

      return csvContent;
    },
  },
};
