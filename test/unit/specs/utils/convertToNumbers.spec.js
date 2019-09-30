import convertToNumbers from '@/utils/convertToNumbers';

describe('`convertToNumbers` utility function', () => {
  it('is working correctly with stringified numeric values', () => {
    const data = {
      value: '30.51',
    };
    const result = convertToNumbers(data);
    expect(typeof result.value).to.equal('number');
  });

  it('is working correctly with non-numeric values', () => {
    const data = {
      string: 'string',
      array: [],
      object: {},
      function: () => { },
      boolean: true,
    };
    const result = convertToNumbers(data);
    expect(result).to.deep.equal(data);
  });
});
