import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

const tbodyNode = document.querySelector('#operations-trade-right-tbody');
const tfootNode = document.querySelector('#operations-trade-right-tfoot');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');
const priceNode = document.querySelector('#operations-trade-price');


const getGoods = (nomenklature, callback) => {
  // markup.tbodyNodeGoods(nomenklature, tbodyNode, callback);

  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];
    stor.operationTradeCurrentGoodPrice = el.dataset['price'];

    if (el.dataset['discount']) {
      stor.operationTradeCurrentGoodOldCount = false;
      stor.operationTradeDiscount = el.dataset['discount'];
    } else {
      stor.operationTradeCurrentGoodOldCount = el.dataset['oldCount'];
      stor.operationTradeDiscount = false;
    }

    callback();
  };

  tbodyNode.innerHTML = '';

  let fragment = document.createDocumentFragment();

  nomenklature.forEach((position, index) => {
    let tr = document.createElement('tr');
    tr.dataset['id'] = position.id;
    tr.dataset['count'] = position.count;
    tr.dataset['price'] = position.price;
    tr.dataset['name'] = position.name;
    tr.scope = 'row';

    if (position.discount) {
      tr.dataset['discount'] = position.discount;
      tr.innerHTML = markup.rightColumnDiscount(position.name, position.count, position.price, position.discount);
      tr.addEventListener('click', clickHandler);
      tfootNode.appendChild(tr);

    } else {

      tr.dataset['oldCount'] = position.oldCount;
      tr.innerHTML = markup.rightColumnGoods(index, position.name, position.count, position.price);
      tr.addEventListener('click', clickHandler);
      fragment.appendChild(tr);
    }


  });

  tbodyNode.appendChild(fragment);
};
const getNum = () => {
  let arrElements = tbodyNode.parentNode.querySelectorAll('tr');

  if (arrElements) {
    let nomenklature = [];

    arrElements.forEach((el) => {
      nomenklature.push({
        'name': el.dataset['name'],
        'id': el.dataset['id'],
        'price': el.dataset['price'],
        'count': el.dataset['count'],
        'oldCount': el.dataset['oldCount'],
        'discount': el.dataset['discount']
      });
    });

    return nomenklature;
  }
  return false;
};

export default {

  clear() {
    tbodyNode.innerHTML = '';
    priceNode.innerHTML = '0';
  },

  setKontragentList(kontragents) {
    kontragents.forEach((el) => {
      kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
    });
  },

  drawPrice(price) {
    priceNode.innerHTML = price;
  },

  drawGoods: getGoods,
  getNomenklature: getNum
};
