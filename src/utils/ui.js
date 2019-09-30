export function addClass(arr) {
  const len = arr.length;
  if (len === 0) return [];
  if (arr[0].side) {
    // If a side prop is available, use buy/sell color-coding (works with Binance markets only)
    for (let i = 0; i < len; i += 1) {
      // The maker was a buy order
      if (arr[i].side === 'buy') arr[i].class = 'cce-color__low';
      // The maker was a sell order
      else arr[i].class = 'cce-color__high';
    }
  } else {
    // Else use the default/previous low/high price color-coding (works with CCE markets)
    let lastClass = 'cce-color__high';
    arr[len - 1].class = lastClass;
    for (let i = len - 1; i >= 0; i -= 1) {
      if (i > 0) {
        // price went down
        if (arr[i - 1].unitPrice < arr[i].unitPrice) lastClass = 'cce-color__low';
        // price went up
        if (arr[i - 1].unitPrice > arr[i].unitPrice) lastClass = 'cce-color__high';
        arr[i - 1].class = lastClass;
      }
    }
  }
  return arr;
}

export function zeros(value) {
  if (value === undefined) {
    return '';
  }
  value = value.toString();
  if (value === '0' || value.indexOf('.') === -1) {
    return value;
  }

  const sign = value.indexOf('-') === -1 ? '' : '-';
  const str = value.replace('-', '').split('.');
  const r = /[0]+$/;
  const o = value.match(r);

  const head = str[0] === '0' ? '<span class="cce-trade__opacity">0</span>' : str[0];
  const tail = o ? `${str[1].replace(r, '')}<span class="cce-trade__opacity">${o[0]}</span>` : str[1];

  return `${sign}${head}.${tail}`;
}
