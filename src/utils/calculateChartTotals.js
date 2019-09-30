/**
 * Calculates total volumes for the depth chart data
 * @param {Array<Array<Number>>} data orders in format [price, amount, rateUSDC, flag, ...]
 * @param {Boolean} isSellAction is current action "buy" or "sell"
 * @returns {Array<Number>}
 */
export function calculateSums(data, isSellAction) {
  const sums = [];
  let total = 0;
  data.forEach((order) => {
    total += order[1];
    sums.push(total);
  });
  return isSellAction ? sums : sums.reverse();
}

/**
 * Changes data structure using calculated volumes for the depth chart data
 * @param {Array<Array<Number>>} data orders in format [price, amount, rateUSDC, flag, ...]
 * @param {Boolean} isSellAction is current action "buy" or "sell"
 * @returns {Array<Array<Number>>}
 */
export default function calculateChartTotals(data, isSellAction) {
  const calculated = data.map(order => [order[0], order[0] * order[1], ...order.slice(2)]);
  const sums = calculateSums(data, isSellAction);
  return calculated.map((order, i) => [
    order[0],
    sums[i],
    ...order.slice(2),
  ]);
}
