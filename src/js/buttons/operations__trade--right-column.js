import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

const tableNode = document.querySelector('#operations-trade-right');
const tbodyNode = tableNode.querySelector('tbody');
const tfootNode = tableNode.querySelector('tfoot');
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
      stor.operationTradeRightClickType = true;
    } else {
      stor.operationTradeCurrentGoodOldCount = true;
      // stor.operationTradeCurrentGoodOldCount = el.dataset['oldCount'];
      stor.operationTradeRightClickType = false;
    }

    callback();
  };

  tbodyNode.innerHTML = '';
  tfootNode.innerHTML = '';

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
  let goodEl = tbodyNode.querySelectorAll('tbody tr');
  let discEl = tfootNode.querySelector('tfoot tr');

  if (goodEl.length === 0 && !discEl) {
    return false;
  }

  let nomenklature = [];

  goodEl.forEach((el) => {
    nomenklature.push({
      'name': el.dataset['name'],
      'id': el.dataset['id'],
      'price': el.dataset['price'],
      'count': el.dataset['count'],
      'oldCount': el.dataset['oldCount'],
    });
  });

  if (discEl) {
    nomenklature.push({
      'name': discEl.dataset['name'],
      'id': discEl.dataset['id'],
      'price': discEl.dataset['price'],
      'count': discEl.dataset['count'],
      'discount': discEl.dataset['discount']
    });
  }

  return nomenklature;
};

export default {

  clear() {
    tbodyNode.innerHTML = '';
    tfootNode.innerHTML = '';
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
