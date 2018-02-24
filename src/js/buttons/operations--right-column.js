import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

const tableNodeTrade = document.querySelector('#operations-trade-right');
const tbodyNodeTrade = tableNodeTrade.querySelector('tbody');
const tfootNodeTrade = tableNodeTrade.querySelector('tfoot');

const tableNodeInventory = document.querySelector('#operation-inventory-right');
const tbodyNodeInventory = tableNodeInventory.querySelector('tbody');


const kontragentsListTrade = document.querySelector('#operations-purchase-kontragents-list');
const kontragentsListInventory = document.querySelector('#operation-inventory-kontragents-list');
const priceNode = document.querySelector('#operations-trade-price');

const getTradeGoods = (nomenklature, callback) => {
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
      // stor.operationTradeCurrentGoodOldCount = true;
      stor.operationTradeCurrentGoodOldCount = el.dataset['oldCount'];
      stor.operationTradeRightClickType = false;
    }

    callback();
  };

  tbodyNodeTrade.innerHTML = '';
  tfootNodeTrade.innerHTML = '';

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
      tfootNodeTrade.appendChild(tr);

    } else {

      tr.dataset['oldCount'] = position.oldCount;
      tr.innerHTML = markup.rightColumnGoods(index, position.name, position.count, position.price);
      tr.addEventListener('click', clickHandler);
      fragment.appendChild(tr);
    }
  });

  tbodyNodeTrade.appendChild(fragment);
};

const getInventoryGoods = (nomenklature, callback) => {
  console.log('gri');
  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];

    // stor.operationTradeCurrentGoodOldCount = true;
    stor.operationTradeCurrentGoodOldCount = el.dataset['oldCount'];
    stor.operationTradeRightClickType = false;

    callback();
  };

  tbodyNodeInventory.innerHTML = '';

  let fragment = document.createDocumentFragment();

  nomenklature.forEach((position, index) => {
    let tr = document.createElement('tr');
    tr.dataset['id'] = position.id;
    tr.dataset['count'] = position.count;
    tr.dataset['name'] = position.name;
    tr.dataset['oldCount'] = position.oldCount;
    tr.dataset['curCount'] = position.curCount;
    tr.scope = 'row';

    tr.innerHTML = markup.rightColumnGoodsInventory(index, position.name, position.count, position.curCount);

    tr.addEventListener('click', clickHandler);
    fragment.appendChild(tr);
  });

  tbodyNodeInventory.appendChild(fragment);
};

const getGoods = (nomenklature, callback) => {
  if (stor.operationTradeType === '7') {
    getInventoryGoods(nomenklature, callback);
  } else {
    getTradeGoods(nomenklature, callback);
  }
};

const getNum = () => {
  let goodEl;
  let discEl = false;

  if (stor.operationTradeType === '7') {
    goodEl = tbodyNodeInventory.querySelectorAll('tbody tr');
  } else {
    goodEl = tbodyNodeTrade.querySelectorAll('tbody tr');
    discEl = tfootNodeTrade.querySelector('tfoot tr');
  }

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
      'curCount': el.dataset['curCount']
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
    let tbodyNode;

    if (stor.operationTradeType !== '7') {
      tbodyNode = tbodyNodeTrade;
      tfootNodeTrade.innerHTML = '';
      priceNode.innerHTML = '0';
    } else {
      tbodyNode = tbodyNodeInventory;
    }

    tbodyNode.innerHTML = '';

  },

  setKontragentList(kontragents) {
    let kontragentsList = (stor.operationTradeType === '7') ? kontragentsListInventory : kontragentsListTrade;

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
