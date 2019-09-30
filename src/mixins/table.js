/**
 * Data-table component related methods
 */

export default {
  methods: {
    /**
     * Dynamically caclculates table cell widths depending on table header cells
     * and manipulate DOM elements
     * @param {String} headerRowId <tr> tag ID who's cells to take as a base
     * @param {String} targetRowId <tr> tag ID who's cells should be updated
     */
    calculateCellsWidthByHeaders(headerRowId, targetRowId) {
      const tableHeader = document.getElementById(headerRowId);
      const totalRow = document.getElementById(targetRowId);
      const headerCells = Array.from(tableHeader.cells);
      const totalCells = Array.from(totalRow.cells);
      headerCells.forEach((headerCell, index) => {
        totalCells[index].style.width = `${headerCell.clientWidth}px`;
      });
    },
  },
};
