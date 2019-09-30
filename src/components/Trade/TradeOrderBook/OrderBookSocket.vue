<template>
</template>

<script>
import Sockette from 'sockette';
import throttle from 'just-throttle';

const socketUrl = 'wss://stream.binance.com:9443/ws/';

/* eslint-disable */
export default {
  name: 'orderbook-socket',
  data() {
    return {
      socketInstance: undefined,
      itemsBuffer: [],
    };
  },
  created() {
    this.initSocket();
  },
  beforeDestroy() {
    this.closeSocket();
    this.$store.dispatch('EmptyBuffer');
    // listening for type or currency change would not work
    // as the component is destroyed on router navigation
  },
  methods: {
    dispatchProcessedBuffer() {
      // console.log('dispatchAddtoBuffer ', this.itemsBuffer);
      // console.log('dispatchAddtoBufferPrice ', this.stats.lastPrice);
      // debugger;
      const payload = {
        items: [...this.itemsBuffer],
        replace: false,
        lastPrice: this.stats.lastPrice
      };
      this.$store.dispatch('AddToBuffer', payload);
      this.itemsBuffer = [];
    },
    throttledAddToBuffer: throttle((ctx) => {
      // debugger;
      ctx.dispatchProcessedBuffer();
      // console.log('dispatchProcessedBuffer');
    }, 100),
    addToLocalBuffer(items) {
      const processedItems = this.processItems(items);
      this.itemsBuffer = this.itemsBuffer.concat(processedItems);
      this.throttledAddToBuffer(this);
    },
    initSocket() {
      const currency = this.currency.indexOf('bch') > -1 ? 'bcc' : this.currency;
      // binance bcc/bch mismatch workaround
      if(!this.currency || !this.type) {
        return;
      }
      const url = `${socketUrl}${currency.toLowerCase()}${this.type.toLowerCase()}@depth`;
      // console.log('URL', url);
      this.socketInstance = new Sockette(url, {
        timeout: 5e3,
        maxAttempts: 20,
        onclose: (e) => {
          // console.log('Connection CLOSED ', e);
        },
        onopen: (e) => {
          // console.log('Connection OPENED', e);
        },
        onmessage: (e) => {
          const items = this.processItems(JSON.parse(e.data));
          // console.log('Message received', items);
          // this.$store.dispatch('AddToBuffer', items);
          if (!this.loadingAsk && !this.loadingBid) {
            this.addToLocalBuffer(JSON.parse(e.data));
          }
        },
        onreconnect: (e) => {
//          console.log('MARKET RATES SOCKET RECONNECT TRIGGERED', e);
        },
      });
    },
    closeSocket() {
      if (this.socketInstance) {
//        console.log('CLOSING SOCKET INSTANCE', this.socketInstance);
        this.socketInstance.close();
      }
    },
    getNewArray(prices) {
      const newArray = [];
      prices.forEach((el) => {
        newArray.push({
          unitPrice: parseFloat(el[0]),
          totalVolume: parseFloat(el[1]) * parseFloat(el[0]),
          totalAmount: parseFloat(el[1]),
        });
      });
      return newArray;
    },
    processItems(items) {
      const newAsks = this.getNewArray(items.a);
      const newBids = this.getNewArray(items.b);
      return ({
        a: newAsks,
        b: newBids,
      });
    },
  },
  computed: {
    currency() {
      return this.$store.getters['market/currency'] || '';
    },
    type() {
      return this.$store.getters['market/type'] || '';
    },
    snapAsks() {
      return this.$store.getters['market/ask'] || [];
    },
    snapBids() {
      return this.$store.getters['market/bid'] || [];
    },
    loadingAsk() {
      return this.$store.getters['market/loadingArray']('orderBook_ask');
    },
    loadingBid() {
      return this.$store.getters['market/loadingArray']('orderBook_bid');
    },
    stats() {
      return this.$store.getters['market/info'] || {};
    },
  },
  watch: {
    snapAsks(items) {
      if (items.length > 0) {
        this.$store.dispatch('SetBuffer', {
        buffer: {
          asks: items,
          bids: [],
        }, replace: false,});
      }
    },
    snapBids(items) {
      if (items.length > 0) {
        this.$store.dispatch('SetBuffer', {
        buffer: {
          asks: [],
          bids: [...items].reverse(),
        }, replace: false,});
      }
    },
  },
};
</script>
