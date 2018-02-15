import markup from './../markup/operation__trade.js';

let rightColumn = document.querySelector('#operations-trade-right');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');

const getGoods = (nomenklature, callback) => {
  markup.rightColumnGoods(nomenklature, rightColumn, callback);
};

export default {

  clear() {
    rightColumn.innerHTML = '';
  },

  setKontragentList(kontragents) {
    kontragents.forEach((el) => {
      kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
    });
  },

  drawGoods: getGoods,
};
