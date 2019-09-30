import calculateChartTotals, { calculateSums } from '@/utils/calculateChartTotals';

describe('`calculateSums` utility function', () => {
  it('calculates sums correctly', () => {
    const mockData = [
      [1, 12],
      [2, 15],
    ];
    expect(calculateSums(mockData, true)).to.deep.equal([12, 12 + 15]);
    expect(calculateSums(mockData, false)).to.deep.equal([12 + 15, 12]);
  });
});

describe('`calculateChartTotals` utility function', () => {
  it('changes data correctly', () => {
    const mockData = [
      [1, 12],
      [2, 15],
    ];
    expect(calculateChartTotals(mockData, true)).to.deep.equal([[1, 12], [2, 12 + 15]]);
    expect(calculateChartTotals(mockData, false)).to.deep.equal([[1, 12 + 15], [2, 12]]);
  });
});
