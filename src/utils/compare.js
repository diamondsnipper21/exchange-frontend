// export default {
//   sortByCreatedAt(a, b) {
//     if (a.createdAt > b.createdAt) {
//       return -1;
//     }
//     return a.createdAt === b.createdAt ? 0 : 1;
//   },
//   sortByUnitPrice(a, b) {
//     if (a.unitPrice > b.unitPrice) {
//       return -1;
//     }
//     return a.unitPrice === b.unitPrice ? 0 : 1;
//   },
//   sortByAvailableBalance(a, b) {
//     if (a.availableBalance > b.availableBalance) return -1;
//     return a.availableBalance === b.availableBalance ? 0 : 1;
//   },
// };

/**
 * Compares items to sort
 * @param {*} a first element for comparison
 * @param {*} b second element for comparison
 * @param {String} propertyToSortBy optional argument for sorting objects by prop
 * @returns {Number}
 */
export default function compare(a, b, propertyToSortBy = null) {
  if (!propertyToSortBy) {
    if (a > b) return -1;
    return a === b ? 0 : 1;
  }
  if (a[propertyToSortBy] > b[propertyToSortBy]) return -1;
  return a[propertyToSortBy] === b[propertyToSortBy] ? 0 : 1;
}
