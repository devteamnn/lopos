import markup from './../markup/operation__trade.js';

const rightColumn = document.querySelector('#operations-trade-right');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');
const priceNode = document.querySelector('#operations-trade-price');


const getGoods = (nomenklature, callback) => {
  markup.rightColumnGoods(nomenklature, rightColumn, callback);

  let price = 0;

  nomenklature.forEach((el) => {
    price += Number(el.count) * Number(el.price);
  });
  priceNode.innerHTML = price;
};

const getNum = () => {
  let arrElements = rightColumn.querySelectorAll('tr');

  if (arrElements) {
    let nomenklature = [];

    arrElements.forEach((el) => {
      nomenklature.push({
        'name': el.dataset['name'],
        'id': el.dataset['id'],
        'price': el.dataset['price'],
        'count': el.dataset['count'],
      });
    });
    return nomenklature;
  }
  return false;
};

export default {

  clear() {
    rightColumn.innerHTML = '';
    priceNode.innerHTML = '0';
  },

  setKontragentList(kontragents) {
    kontragents.forEach((el) => {
      kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
    });
  },

  drawGoods: getGoods,
  getNomenklature: getNum
};
