import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';
import validation from './../tools/single-validation.js';

const tableNodePurchase = document.querySelector('#operations-purchase-right');
const tbodyNodePurchase = tableNodePurchase.querySelector('tbody');

const tableNodeSale = document.querySelector('#operations-sale-right');
const tbodyNodeSale = tableNodeSale.querySelector('tbody');
const tfootNodeSale = tableNodeSale.querySelector('tfoot');

const tableNodeInventory = document.querySelector('#operation-inventory-right');
const tbodyNodeInventory = tableNodeInventory.querySelector('tbody');


const kontragentsListSale = document.querySelector('#operations-sale-kontragents-list');
const kontragentsListInventory = document.querySelector('#operation-inventory-kontragents-list');

const priceNodePurchase = document.querySelector('#operations-purchase-price');
const priceNodeSale = document.querySelector('#operations-sale-price');

const purchaseSubmit = document.querySelector('#operations-purchase-submit');
const saleSubmit = document.querySelector('#operations-sale-submit');
const inventorySubmit = document.querySelector('#operation-inventory-submit');

const searchBarcodeForm = document.querySelector('#operations-purchase-search-barcode-form');

const getPurchaseGoods = (nomenklature, callback) => {
  const setStor = (el) => {
    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];
    stor.operationTradeCurrentGoodPrice = el.dataset['price'];
    stor.operationTradeCurrentGoodOldCount = el.dataset['oldCount'];
    stor.operationTradeRightClickType = false;
    stor.operationTradeCurrentGoodPriceSell = el.dataset['priceSell'];
    stor.operationTradeMarkupGood = el.dataset['markupGood'];
  };

  const clickHandler = (evt) => {
    setStor(evt.target);
    callback('click', evt.target);
  };

  const keyHandler = (evt) => {
    searchBarcodeForm.barcode.blur();
    switch (evt.keyCode) {
    // ESC
    case 27:
      evt.target.blur();
      break;
    // ENTER
    case 13:
      if (validation.valid(evt.target)) {
        if (evt.target.value === evt.target.dataset['oldvalue']) {
          evt.target.blur();
          break;
        }
        setStor(evt.target);
        callback('key', evt.target);
      }
      break;
    }
  };

  tbodyNodePurchase.innerHTML = '';

  let fragment = document.createDocumentFragment();

  nomenklature.forEach((position, index) => {

    let positionKeys = Object.keys(position);

    positionKeys.forEach((key) => {
      if (key !== 'id' && key !== 'name' && key !== 'newRow') {
        position[key] = Number(position[key]).toFixed(2);
      }
    });

    let tr = document.createElement('tr');
    tr.dataset['id'] = position.id;
    tr.dataset['count'] = position.count;
    tr.dataset['price'] = position.price;
    tr.dataset['sumPurchase'] = position.sumPurchase;
    tr.dataset['name'] = position.name;
    tr.dataset['priceSell'] = position.priceSell;
    tr.dataset['currMarkup'] = position.currMarkup;
    tr.dataset['markupGood'] = position.markupGood;
    tr.dataset['oldCount'] = position.oldCount;
    tr.dataset['sumSale'] = position.sumSale;
    tr.scope = 'row';

    if (position.newRow) {

      tr.classList.add('purchase-last-row');
    }

    tr.innerHTML = markup.rightColumnGoodsPurchase(position.id, index,
      position.name, position.count, position.price, position.sumPurchase,
      position.markupGood, position.priceSell, position.currMarkup,
      position.sumSale);

    tr.addEventListener('dblclick', clickHandler);
    tr.addEventListener('keydown', keyHandler);

    fragment.appendChild(tr);
  });

  tbodyNodePurchase.appendChild(fragment);
};

const getSaleGoods = (nomenklature, callback) => {
  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];
    stor.operationTradeCurrentGoodPrice = el.dataset['price'];
    stor.operationTradeCurrentGoodStartCount = el.dataset['startCount'];

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

  tbodyNodeSale.innerHTML = '';
  tfootNodeSale.innerHTML = '';

  let fragment = document.createDocumentFragment();

  nomenklature.forEach((position, index) => {
    let tr = document.createElement('tr');
    tr.dataset['id'] = position.id;
    tr.dataset['count'] = position.count;
    tr.dataset['price'] = position.price;
    tr.dataset['name'] = position.name;
    tr.dataset['startCount'] = position.startCount;
    tr.scope = 'row';

    if (position.newRow) {
      tr.classList.add('sale-last-row');
    }

    if (position.discount) {
      tr.dataset['discount'] = position.discount;
      tr.innerHTML = markup.rightColumnDiscount(position.name, position.count, position.price, position.discount);
      tr.addEventListener('click', clickHandler);
      tfootNodeSale.appendChild(tr);

    } else {

      tr.dataset['oldCount'] = position.oldCount;
      tr.innerHTML = markup.rightColumnGoodsSale(index, position.name, position.count, position.price);
      tr.addEventListener('click', clickHandler);
      fragment.appendChild(tr);
    }
  });

  tbodyNodeSale.appendChild(fragment);
};

const getInventoryGoods = (nomenklature, callback) => {
  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];
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
    tr.scope = 'row';

    if (position.newRow) {
      tr.classList.add('table-primary');
    }

    tr.innerHTML = markup.rightColumnGoodsInventory(index, position.name, position.count, position.oldCount);

    tr.addEventListener('click', clickHandler);
    fragment.appendChild(tr);
  });

  tbodyNodeInventory.appendChild(fragment);
};

const getGoods = (nomenklature, callback) => {
  switch (stor.operationTradeType) {
  case '0':
    getPurchaseGoods(nomenklature, callback);
    break;
  case '1':
    getSaleGoods(nomenklature, callback);
    break;
  case '7':
    getInventoryGoods(nomenklature, callback);
    break;
  }
};

const getNum = () => {
  let goodEl;
  let discEl = false;

  switch (stor.operationTradeType) {
  case '0':
    goodEl = tbodyNodePurchase.querySelectorAll('tbody tr');
    break;
  case '1':
    goodEl = tbodyNodeSale.querySelectorAll('tbody tr');
    discEl = tfootNodeSale.querySelector('tfoot tr');
    break;
  case '7':
    goodEl = tbodyNodeInventory.querySelectorAll('tbody tr');
    break;
  }

  if (goodEl.length === 0 && !discEl) {
    return false;
  }

  let nomenklature = [];

  goodEl.forEach((el, index) => {
    nomenklature.push({
      'name': el.dataset['name'],
      'id': el.dataset['id'],
      'price': el.dataset['price'],
      'count': el.dataset['count'],
      'oldCount': el.dataset['oldCount'],
      'curCount': el.dataset['curCount']
    });

    switch (stor.operationTradeType) {
    case '0':
      nomenklature[index].markupGood = el.dataset['markupGood'];
      nomenklature[index].priceSell = el.dataset['priceSell'];
      nomenklature[index].currMarkup = el.dataset['currMarkup'];
      nomenklature[index].sumSale = el.dataset['sumSale'];
      nomenklature[index].sumPurchase = el.dataset['sumPurchase'];
      break;
    case '1':
      if (discEl) {
        nomenklature.push({
          'name': discEl.dataset['name'],
          'id': discEl.dataset['id'],
          'price': discEl.dataset['price'],
          'count': discEl.dataset['count'],
          'discount': discEl.dataset['discount']
        });
      }
      break;
    case '7':
      nomenklature[index].startCount = el.dataset['startCount'];
      break;
    }
  });

  return nomenklature;
};

export default {

  clear() {
    let tbodyNode;

    switch (stor.operationTradeType) {
    case '0':
      purchaseSubmit.disabled = true;
      tbodyNode = tbodyNodePurchase;
      priceNodePurchase.innerHTML = '0';
      break;
    case '1':
      saleSubmit.disabled = true;
      tbodyNode = tbodyNodeSale;
      tfootNodeSale.innerHTML = '';
      priceNodeSale.innerHTML = '0';
      break;
    case '7':
      tbodyNode = tbodyNodeInventory;
      inventorySubmit.disabled = true;
      break;
    }

    tbodyNode.innerHTML = '';


  },

  setKontragentList(kontragents) {
    let kontragentsList = (stor.operationTradeType === '7') ? kontragentsListInventory : kontragentsListSale;

    kontragentsList.innerHTML = '';

    kontragents.forEach((el) => {
      kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
    });
  },

  drawPrice(price) {
    switch (stor.operationTradeType) {
    case '0':
      priceNodePurchase.innerHTML = price;
      break;
    case '1':
      priceNodeSale.innerHTML = price;
      break;
    }
  },

  drawGoods: getGoods,
  getNomenklature: getNum
};
