import stor from './../tools/storage.js';
import tools from './../tools/tools.js';
import serverTools from './operations--server-tools.js';
import leftColumn from './operations--left-column.js';
import rightColumn from './operations--right-column.js';
import operationsHeader from './operations--header.js';
import operationsModalAdd from './operations--good-add.js';

import goodCard from './catalog__goods.js';
import markupTools from './../markup/tools.js';

const listReceipt = document.querySelector('#list-receipt');

const searchBarcodeForm = document.querySelector('#operations-purchase-search-barcode-form');
const searchBarcodeFormBarcode = document.querySelector('#operations-purchase-search-barcode');

const tradeForm = document.querySelector('#operations-purchase-form');
const tradeFormStock = document.querySelector('#operations-purchase-stocks-list');
const tradeFormSubmit = document.querySelector('#operations-purchase-submit');
const tradeFormKontragents = document.querySelector('#operations-purchase-kontragents-list');
const tradeFormDelivery = document.querySelector('#operations-purchase-delivery');

const searchForm = document.querySelector('#operations-purchase-search');
const modalGroup = document.querySelector('#operations-purchase-modal-goods');
const modalAdd = document.querySelector('#operations-trade-add');
const modalAddCount = document.querySelector('#operations-trade-add-input');

const leftColumnNode = document.querySelector('#operations-purchase-left');
const submitSpinner = document.querySelector('#operation-purchase-submit-spinner');

const goodAddButton = document.querySelector('#operations-purchase-add-good');
const goodsCardNode = document.querySelector('#goods-card');

let dataStore = [];
let dataGoods = [];
let nomCard = []; // номенклатура
let dataFind = [];

// возвращает индекс найденного объекта
// array - массив в котором искать
// id - id товара
// если товар не найден - возврщает 'none'
const searchGoodById = (array, id) => {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return i;
      }
    }
  }
  return 'none';
};

const showGoodCard = () => {
  const hideGoodCardHandler = () => {
    $(goodsCardNode).unbind('hidden.bs.modal');
    setTimeout(() =>{
      $(modalGroup).modal('show');
    }, 500);
  };

  $(goodsCardNode).on('hidden.bs.modal', hideGoodCardHandler);

  setTimeout(() =>{
    goodCard.fill();
  }, 500);
};

const redrawColumn = () => {
  if (stor.operationTradeIsFind === 'true') {
    switch (stor.operationTradeCurrentOpen) {
    case 'groups':
      leftColumn.drawFind(dataFind, clickGroupsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
      break;
    case 'goods':
      if (stor.operationTradeIsFindToBarcode === 'true') {
        leftColumn.drawFind(dataFind, clickLeftFindToBarcodeCallack, clichButtonBackCallback, 'goods');
      } else {
        leftColumn.drawFind(dataFind, clickLeftGoodsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
      }
      break;
    }
  } else {
    switch (stor.operationTradeCurrentOpen) {
    case 'groups':
      leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback);
      break;
    case 'goods':
      leftColumn.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
      break;
    }
  }

  rightColumn.drawPrice(calcNumSum());
  rightColumn.drawGoods(nomCard, clickRightGoodsCallback);
};

const focusBarcode = () => {
  searchBarcodeForm.reset();
  if (dataStore.property_list) {
    let perm = tools.serachElements({
      'array': dataStore.property_list,
      'el': '30',
      'strict': true
    });

    if (perm !== 'none') {
      setTimeout(() => {
        searchBarcodeFormBarcode.focus();
      }, 500);
    }
  }
};

const tradeSubmitFormCallback = () => {
  submitSpinner.innerHTML = '';
  leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
  rightColumn.clear();
};

const clickGroupsCallback = () => {
  leftColumnNode.innerHTML = markupTools.getLoadSpinner('sp-2', 'Загрузка');

  let groupe = tools.serachElements({
    'array': dataStore.all_groups,
    'property': 'id',
    'el': stor.currentGroupId,
    'strict': true
  });
  stor.operationTradeMarkupGroup = groupe[0].markup_group;

  serverTools.getGoodsFromServer(stor.currentGroupId, tradeFormStock.value, getGoodsCallback);
};

const clichButtonBackCallback = () => {
  stor.operationTradeIsFindToBarcode = false;
  leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback);
};

const clickRightGood = (el) => {
  const inputBlurHandler = (evt) => {
    evt.target.classList.add('d-none');
    evt.target.placeholder = evt.target.dataset['oldvalue'];
    evt.target.value = '';

    let td = (evt.target.nodeName === 'TD') ? evt.target : evt.target.parentNode;
    let span = td.querySelector('span');

    span.classList.remove('d-none');
    evt.target.removeEventListener('blur', inputBlurHandler);
  };

  if (el.dataset['click'] === 'true') {
    let tdNode = (el.nodeName === 'TD') ? el : el.parentNode;
    let spanNode = tdNode.querySelector('span');
    let inputNode = tdNode.querySelector('input');

    inputNode.addEventListener('blur', inputBlurHandler);

    spanNode.classList.add('d-none');
    inputNode.classList.remove('d-none');
    inputNode.focus();
  }
};

const changeRightGood = (el) => {
  let tr = el;

  while (!tr.dataset['id']) {
    tr = tr.parentNode;
  }

  switch (el.name) {
  case 'count':
    if (el.value === '0') {
      remGoodFromNomCard();
      break;
    }
    changeCount(el.value);
    break;
  case 'price':
    changePrice(el);
    break;
  case 'currMarkup':
    changeCurrMarkup(el);
    break;
  case 'sumPurchase':
    changeSumPurchase(el);
    break;
  case 'priceSell':
    changePriceSell(el);
    break;
  case 'sumSale':
    changePriceSum(el);
    break;
  }
};

const clickRightGoodsCallback = (type, el) => {
  switch (type) {
  case 'click':
    clickRightGood(el);
    break;
  case 'key':
    changeRightGood(el);
    focusBarcode();
    break;
  }
};

const calcSumPurchase = (count, price) => {
  let sum = Number(price) * Number(count);
  sum = sum.toFixed(2);
  return sum;
};

const calcCurrMarkup = (priceSell, pricePurchase) => {
  let currMarkup = (priceSell / pricePurchase - 1) * 100;
  currMarkup = (!isFinite(currMarkup)) ? 0 : currMarkup.toFixed(2);
  return currMarkup;
};

const calcSumSale = (count, priceSell) => {
  let sumSale = count * priceSell;
  sumSale = (!isFinite(sumSale)) ? 0 : sumSale.toFixed(2);
  return sumSale;
};

const addGoodToNomCard = (value, barcode) => {
  nomCard = rightColumn.getNomenklature();

  let goodId = stor.operationTradeCurrentGoodId;

  let goodIndex = searchGoodById(dataGoods, goodId);
  let nomIndex = searchGoodById(nomCard, goodId);

  if (!nomCard) {
    nomCard = [];
  }

  let oldCount;
  let count;
  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = Number(dataGoods[goodIndex].count) + Number(value);

    oldCount = (!barcode) ? dataGoods[goodIndex].count : 'null';
  } else if (nomIndex !== 'none') {
    oldCount = (!barcode) ? count + value : 'none';
  } else {
    oldCount = 'none';
  }

  let sumSaleCount = (nomIndex === 'none') ? value : Number(nomCard[nomIndex].count) + value;

  if (nomIndex === 'none') {
    nomCard.push({
      'id': stor.operationTradeCurrentGoodId,
      'name': stor.operationTradeCurrentGoodName,
      'price': stor.operationTradeCurrentGoodPrice,
      'sumPurchase': calcSumPurchase(value, stor.operationTradeCurrentGoodPrice),
      'priceSell': stor.operationTradeCurrentGoodPriceSell,
      'markupGood': stor.operationTradeMarkupGood,
      'currMarkup': calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice),
      'count': value,
      'oldCount': oldCount,
      'sumSale': calcSumSale(sumSaleCount, stor.operationTradeCurrentGoodPriceSell),
      'newRow': true,
    });
  } else {
    nomCard[nomIndex].count = Number(nomCard[nomIndex].count) + value;
    nomCard[nomIndex].oldCount = oldCount;
    nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
    nomCard[nomIndex].sumPurchase = calcSumPurchase(nomCard[nomIndex].count, stor.operationTradeCurrentGoodPrice);
    nomCard[nomIndex].priceSell = stor.operationTradeCurrentGoodPriceSell;
    nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
    nomCard[nomIndex].currMarkup = calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice);
    nomCard[nomIndex].sumSale = calcSumSale(sumSaleCount, stor.operationTradeCurrentGoodPriceSell);
    nomCard[nomIndex].newRow = true;
  }

  redrawColumn();
  focusBarcode();
  tradeFormSubmit.disabled = false;
};

const changeCount = (value) => {
  let goodId = stor.operationTradeCurrentGoodId;

  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  let oldCount = value;

  nomCard[nomIndex].count = value;
  nomCard[nomIndex].oldCount = oldCount;
  nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(value, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = stor.operationTradeCurrentGoodPriceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = calcSumSale(value, stor.operationTradeCurrentGoodPriceSell);
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

const changePrice = (el) => {
  let goodId = stor.operationTradeCurrentGoodId;

  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  let newPrice = el.value;
  newPrice = Number(newPrice).toFixed(2);

  stor.operationTradeCurrentGoodPrice = newPrice;

  nomCard[nomIndex].count = stor.operationTradeCurrentGoodCount;
  nomCard[nomIndex].oldCount = stor.operationTradeCurrentGoodOldCount;
  nomCard[nomIndex].price = newPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = stor.operationTradeCurrentGoodPriceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = calcSumSale(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPriceSell);
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

const changeSumPurchase = (el) => {
  let goodId = stor.operationTradeCurrentGoodId;

  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  let newPrice = el.value / stor.operationTradeCurrentGoodCount;
  newPrice = newPrice.toFixed(2);

  stor.operationTradeCurrentGoodPrice = newPrice;

  nomCard[nomIndex].count = stor.operationTradeCurrentGoodCount;
  nomCard[nomIndex].oldCount = stor.operationTradeCurrentGoodOldCount;
  nomCard[nomIndex].price = newPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = stor.operationTradeCurrentGoodPriceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = calcSumSale(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPriceSell);
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

const changeCurrMarkup = (el) => {
  let goodId = stor.operationTradeCurrentGoodId;

  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  let newPriceSell = stor.operationTradeCurrentGoodPrice * (1 + (el.value / 100));
  newPriceSell = newPriceSell.toFixed(2);

  nomCard[nomIndex].count = stor.operationTradeCurrentGoodCount;
  nomCard[nomIndex].oldCount = stor.operationTradeCurrentGoodOldCount;
  nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = newPriceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(newPriceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = calcSumSale(stor.operationTradeCurrentGoodCount, newPriceSell);
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

const changePriceSell = (el) => {
  let priceSell = el.value;

  let goodId = stor.operationTradeCurrentGoodId;

  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  nomCard[nomIndex].count = stor.operationTradeCurrentGoodCount;
  nomCard[nomIndex].oldCount = stor.operationTradeCurrentGoodOldCount;
  nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = priceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(priceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = calcSumSale(stor.operationTradeCurrentGoodCount, priceSell);
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

const changePriceSum = (el) => {
  let newSumSell = Number(el.value);
  newSumSell.toFixed(2);

  let goodId = stor.operationTradeCurrentGoodId;
  nomCard = rightColumn.getNomenklature();
  let nomIndex = searchGoodById(nomCard, goodId);

  let newPriceSell = newSumSell / stor.operationTradeCurrentGoodCount;
  newPriceSell.toFixed(2);

  nomCard[nomIndex].count = stor.operationTradeCurrentGoodCount;
  nomCard[nomIndex].oldCount = stor.operationTradeCurrentGoodOldCount;
  nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
  nomCard[nomIndex].sumPurchase = calcSumPurchase(stor.operationTradeCurrentGoodCount, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].priceSell = newPriceSell;
  nomCard[nomIndex].markupGood = stor.operationTradeMarkupGood;
  nomCard[nomIndex].currMarkup = calcCurrMarkup(stor.operationTradeCurrentGoodPriceSell, stor.operationTradeCurrentGoodPrice);
  nomCard[nomIndex].sumSale = newSumSell;
  nomCard[nomIndex].newRow = true;

  redrawColumn();
  tradeFormSubmit.disabled = false;
};

// noDiscount = true, если нужно рассчитать без скидкискидку
const calcNumSum = (noDiscount) => {
  let numSum = 0;

  if (nomCard.length !== 0) {
    if (noDiscount) {
      nomCard.forEach((el) => {
        if (!el.discount) {
          numSum += el.price * el.count;
        }
      });
    } else {
      nomCard.forEach((el) => {
        numSum += el.price * el.count;
      });
    }
  }

  return numSum.toFixed(2);
};

const remGoodFromNomCard = () => {
  let id = stor.operationTradeCurrentGoodId;
  let nomIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = Number(dataGoods[goodIndex].count) - Number(nomCard[nomIndex].count);
  }

  nomCard.splice(nomIndex, 1);

  if (nomCard.length === 0) {
    tradeFormSubmit.disabled = true;
  }
  redrawColumn();
  focusBarcode();
};

const clickLeftGoodsCallback = () => {
  switch (stor.operationClickType) {
  case 'add':
    addGoodToNomCard(1);
    break;
  case 'card':
    stor.currentGoodId = stor.operationTradeCurrentGoodId;
    $(modalGroup).modal('hide');
    showGoodCard();
    break;
  case 'def':
    $(modalGroup).modal('hide');
    showModalAdd();
    break;
  }
};

// !! Вывести в модальное окно
const clickLeftFindToBarcodeCallack = () => {
  stor.operationTradeIsFind = true;
  switch (stor.operationClickType) {
  case 'add':
    addGoodToNomCard(1, true);
    break;
  case 'card':
    stor.currentGoodId = stor.operationTradeCurrentGoodId;
    $(modalGroup).modal('hide');
    showGoodCard();
    break;
  case 'def':
    $(modalGroup).modal('hide');
    showModalAdd();
    break;
  }
};

const correctAmount = (data) => {
  nomCard = rightColumn.getNomenklature();

  if (nomCard) {
    let index;
    nomCard.forEach((el) => {
      index = searchGoodById(data, el.id);
      if (index !== 'none') {
        data[index].count = (stor.operationTradeType === '0') ?
          Number(data[index].count) + Number(el.count) :
          Number(data[index].count) - Number(el.count);
      }
    });
  }
  return data;
};

const getGoodsCallback = (data) => {
  dataGoods = correctAmount(data);
  leftColumn.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
};

const getDataCallback = (data) => {
  dataStore = data;
  operationsHeader.setStocksList(dataStore.all_stocks);
  operationsHeader.setKontragentList(dataStore.all_kontr_agents);
  leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback);
  focusBarcode();
};

const showModalAdd = () => {
  const hideModalAddHandler = () => {
    $(modalAdd).unbind('hidden.bs.modal');
    setTimeout(() =>{
      $(modalGroup).modal('show');
    }, 160);
  };

  setTimeout(() => {
    operationsModalAdd.show(addLeftFormCallback, 'l');
  }, 160);

  $(modalAdd).on('hidden.bs.modal', hideModalAddHandler);


};

const addLeftFormCallback = (count) => {
  setTimeout(() => {
    $(modalGroup).modal('show');
  }, 160);
  addGoodToNomCard(count);
};

const getData = () => {
  serverTools.getDataFromServer(stor.data.currentStock, getDataCallback);
};

const sendTradeForm = () => {
  submitSpinner.innerHTML = markupTools.getLoadSpinner('sp-1', 'Отправка');
  serverTools.sendDataToServer({
    'stock': tradeFormStock.value,
    'kontragent': tradeFormKontragents.value,
    'delivery': (tradeFormDelivery.checked) ? 1 : 0,
    'data': nomCard
  }, tradeSubmitFormCallback, dataStore.discount_id);
};

const addHandlers = () => {

  $(modalAdd).on('shown.bs.modal', function () {
    setTimeout(() => {
      $(modalAddCount).trigger('focus');
    }, 500);
  });

  $(modalGroup).on('hide.bs.modal', function () {
    focusBarcode();
  });

  document.querySelector('#list-receipt-list').addEventListener('click', () => {
    stor.operationTradeType = 0;
    rightColumn.clear();
    getData();
  });

  document.querySelector('#operations-purchase-clear-but').addEventListener('click', () => {
    leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    rightColumn.clear();
  });

  document.querySelector('body').addEventListener('keydown', (evt) => {
    if (evt.altKey && evt.code === 'Enter') {
      evt.preventDefault();

      if (listReceipt.classList.contains('active') && !tradeFormSubmit.disabled) {
        sendTradeForm();
      }
    }
  });

  tradeFormStock.addEventListener('change', () => {
    stor.operationTradeType = 0;
    rightColumn.clear();
  });

  tradeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    tradeFormSubmit.disabled = true;
    sendTradeForm();
  });

  searchBarcodeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    dataFind = tools.serachElements({
      'array': dataStore.all_goods_with_barcode,
      'property': 'barcode',
      'el': evt.target.barcode.value,
      'strict': true
    });

    if (dataFind === 'none') {
      markupTools.informationtModal = {
        'title': 'ОШИБКА',
        'message': 'Товар не найден!'
      };
      return false;
    }

    if (dataFind.length === 1) {
      stor.operationTradeCurrentGoodId = dataFind[0].id;
      stor.operationTradeCurrentGoodName = dataFind[0].name;
      stor.operationTradeCurrentGoodCount = dataFind[0].count;
      stor.operationTradeCurrentGoodPrice = dataFind[0].price_purchase;
      stor.operationTradeCurrentGoodPriceSell = dataFind[0].price_sell;
      stor.operationTradeMarkupGood = ((dataFind[0].markup_good && dataFind[0].markup_good !== 'null') || dataFind[0].markup_good === '0') ? dataFind[0].markup_good :
        dataFind[0].markup_group;

      addGoodToNomCard(1, true);
      return true;
    }
    stor.operationTradeIsFind = true;
    stor.operationTradeCurrentOpen = 'goods';
    stor.operationTradeIsFindToBarcode = true;

    dataFind.forEach((el, index) => {
      dataFind[index].price = dataFind[index].price_purchase;
    });

    leftColumn.drawFind(dataFind, clickLeftFindToBarcodeCallack, clichButtonBackCallback, 'goods');
    $(modalGroup).modal('show');
    return true;
  });

  searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let elName = evt.target.name.value;

    if (!elName) {
      leftColumn.drawHeader('find', clichButtonBackCallback);
      switch (stor.operationTradeCurrentOpen) {
      case 'groups':
        leftColumn.message('Группа не найдена!');
        break;
      case 'goods':
        leftColumn.message('Товар не найден!');
        break;
      }
      return false;
    }

    let callback;

    switch (stor.operationTradeCurrentOpen) {
    case 'groups':
      dataFind = tools.serachElements({
        'array': dataStore.all_groups,
        'property': 'name',
        'el': elName
      });

      callback = clickGroupsCallback;
      break;
    case 'goods':
      dataFind = tools.serachElements({
        'array': dataGoods,
        'property': 'name',
        'el': elName
      });
      callback = clickLeftGoodsCallback;
      break;
    }

    if (dataFind === 'none') {
      leftColumn.drawHeader('find', clichButtonBackCallback);

      switch (stor.operationTradeCurrentOpen) {
      case 'groups':
        leftColumn.message('Группа не найдена!');
        break;
      case 'goods':
        leftColumn.message('Товар не найден!');
        break;
      }

      return false;
    }

    leftColumn.drawFind(dataFind, callback, clichButtonBackCallback, stor.operationTradeCurrentOpen);

    return true;
  });

  goodAddButton.addEventListener('click', () => {
    $(modalGroup).modal('show');
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
