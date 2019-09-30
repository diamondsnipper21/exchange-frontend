import convert from '@/directives/date';

describe('`convert` date function', () => {
  it('returns correct date string', () => {
    const dateString = '2000-03-30 23:59:59';
    // PhantomJS doesn't handle YYYY-MM-DD Date format
    // Replace all "-" by "/" characters
    const dateTimestamp = new Date(dateString.replace(/-/g, '/')).getTime();
    const convertedDate = convert(dateTimestamp);
    expect(convertedDate).to.equal(dateString);
  });

  it('returns \'space\' character if the timestamp is not provided', () => {
    const result = convert();
    expect(result).to.equal('&nbsp;');
  });
});
