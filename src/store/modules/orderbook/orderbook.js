import compare from '@/utils/compare';

function filterZeros(items, childSelector) {
  return items
    .map(item => item[childSelector].filter(order => order.totalAmount > 0))
    .flatten();
}

const orderbook = {
  state: {
    orderBookBuffer: {
      asks: [],
      bids: [],
    },
  },
  mutations: {
    EMPTY_BUFFER: (state) => {
      state.orderBookBuffer.asks = [];
      state.orderBookBuffer.bids = [];
    },
    SET_BUFFER: (state, { buffer, replace }) => {
      if (buffer.asks.length > 0 || replace) {
        state.orderBookBuffer.asks = [...buffer.asks];
      }
      if (buffer.bids.length > 0 || replace) {
        state.orderBookBuffer.bids = [...buffer.bids];
      }
    },
    ADD_TO_BUFFER: (state, { items, replace, lastPrice }) => {
      if (!items || !items.length) {
        return;
      }
      // const asks = items.map(el => el.a).flatten();
      // const bids = items.map(el => el.b).flatten();
      const asks = filterZeros(items, 'a');
      const bids = filterZeros(items, 'b');

      let oldAsks = state.orderBookBuffer.asks;
      let oldBids = state.orderBookBuffer.bids;
      if (!replace) {
      // need to iterate over the pairs in received asks and bids
        asks.forEach((pair) => {
          let foundFlag = false;
          for (let i = 0; i < oldAsks.length; i += 1) {
            if (oldAsks[i].unitPrice === pair.unitPrice) {
              oldAsks[i].totalAmount = pair.totalAmount;
              oldAsks[i].totalVolume = pair.totalAmount * pair.unitPrice;
              foundFlag = true;
            }
          }
          if (!foundFlag) {
            oldAsks.push(pair);
          }
        });

        bids.forEach((pair) => {
          let foundFlag = false;
          for (let i = 0; i < oldBids.length; i += 1) {
            if (oldBids[i].unitPrice === pair.unitPrice) {
              oldBids[i].totalAmount = pair.totalAmount;
              oldBids[i].totalVolume = pair.totalAmount * pair.unitPrice;
              foundFlag = true;
            }
          }
          if (!foundFlag) {
            oldBids.push(pair);
          }
        });
      } else {
        oldBids = bids;
        oldAsks = asks;
      }

      const sortedAsks = oldAsks
        .filter(elem => elem.totalAmount > 0 && elem.unitPrice > lastPrice)
        .sort((a, b) => compare(a, b, 'unitPrice'));

      const limit = 25;
      let len = sortedAsks.length;
      const newAsks = len > limit ? sortedAsks.slice(len - limit, len) : sortedAsks;

      const sortedBids = oldBids
        .filter(elem => elem.totalAmount > 0 && elem.unitPrice < lastPrice)
        .sort((a, b) => compare(a, b, 'unitPrice'));

      len = sortedBids.length;
      const newBids = len > limit ? sortedBids.slice(0, limit) : sortedBids;

      const newBuffer = {
        asks: newAsks,
        bids: newBids,
      };

      state.orderBookBuffer = { ...newBuffer,
      };
    },
    REMOVE_ITEM: (state, item) => {
      state.orderBookBuffer = state.orderBookBuffer.filter(element => element !== item);
    },
  },
  actions: {
    EmptyBuffer({ commit }) {
      commit('EMPTY_BUFFER');
    },
    SetBuffer({
      commit,
    }, payload) {
      commit('SET_BUFFER', payload);
    },
    AddToBuffer({
      commit,
    }, payload) {
      // console.log('action last price', payload.lastPrice);
//      console.log('action items', payload.items);
        // debugger;
      commit('ADD_TO_BUFFER', payload);
    },
    RemoveItem({
      commit,
      state,
    }, item) {
      return new Promise((resolve) => {
        commit('REMOVE_ITEM', item);
        resolve([...state.orderBookBuffer]);
      });
    },
  },
  getters: {
    orderBookBuffer: state => state.orderBookBuffer,
    ask(state) {
      return state.orderBookBuffer.asks;
    },
    bid(state) {
      return state.orderBookBuffer.bids;
    },
  },
};

export default orderbook;
