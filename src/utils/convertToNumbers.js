/**
 * Converts all possible object values into numbers
 * @param {Object} targetObject object to convert
 * @returns {Object} object with strings converted into numbers
 */
export default function convertToNumbers(targetObject) {
  const converted = {};
  if (!targetObject || typeof targetObject !== 'object') {
    return targetObject;
  }
  Object.keys(targetObject).forEach((key) => {
    if (
      typeof targetObject[key] === 'string' &&
      !isNaN(Number(targetObject[key])) &&
      targetObject[key] !== ''
    ) {
      converted[key] = Number(targetObject[key]);
    } else {
      converted[key] = targetObject[key];
    }
  });
  return converted;
}
