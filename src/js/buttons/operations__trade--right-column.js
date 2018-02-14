import markUp from './../tools/operation__trade.js';

let leftColumn;

const getGoods = (nomenklature, callback) => {
  markUp.rightColumnGoods(nomenklature, leftColumn, callback);
};

export default {
  start() {
    leftColumn = document.querySelector('#operations-trade-right');
  },
  drawGoods: getGoods
};
