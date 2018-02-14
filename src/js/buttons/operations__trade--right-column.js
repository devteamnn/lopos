import markup from './../markup/operation__trade.js';

let rightColumn;

const getGoods = (nomenklature, callback) => {
  markup.rightColumnGoods(nomenklature, rightColumn, callback);
};

export default {
  start() {
    rightColumn = document.querySelector('#operations-trade-right');
  },
  drawGoods: getGoods,
  clear() {
    rightColumn.innerHTML = '';
  }
};
