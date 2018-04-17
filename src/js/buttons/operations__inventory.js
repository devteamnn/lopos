import stor from './../tools/storage.js';
import tools from './../tools/tools.js';
import serverTools from './operations--server-tools.js';
import leftColumn from './operations--left-column.js';
import rightColumn from './operations--right-column.js';
import appHeader from './operations--header.js';
import operationsTradeAdd from './operations--good-add.js';

import goodCard from './catalog__goods.js';
import markupTools from './../markup/tools.js';

const searchBarcodeForm = document.querySelector('#operations-inventory-search-barcode-form');
const searchBarcodeFormBarcode = document.querySelector('#operations-inventory-search-barcode');

const searchForm = document.querySelector('#operation-inventory-search');

const inventoryForm = document.querySelector('#operation-inventory-form');
const inventoryFormStock = document.querySelector('#operation-inventory-stocks-list');
const inventoryFormSubmit = document.querySelector('#operation-inventory-submit');

const submitSpinner = document.querySelector('#operation-inventory-submit-spinner');
const leftColumnNode = document.querySelector('#operation-inventory-left');

const listInventory = document.querySelector('#list-inventory');
const modalAdd = document.querySelector('#operations-trade-add');
const modalAddCount = document.querySelector('#operations-trade-add-input');
const modalDiscount = document.querySelector('#operations-trade-discount');
const modalDiscountCount = document.querySelector('#operations-trade-discount-input');

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

const redrawColumn = () => {
  if (stor.operationTradeIsFind === 'true') {
    switch (stor.operationTradeCurrentOpen) {
    case 'groups':
      leftColumn.drawFind(dataFind, clickGroupsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
      break;
    case 'goods':
      leftColumn.drawFind(dataFind, clickLeftGoodsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
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

  rightColumn.drawGoods(nomCard, clickRightGoodsCallback);
  focusBarcode();
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
  serverTools.getGoodsFromServer(stor.currentGroupId, inventoryFormStock.value, getGoodsCallback);
};

const clichButtonBackCallback = () => {
  leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback);
};

const clickRightGoodsCallback = () => {
  operationsTradeAdd.show(addRightFormCallback, 'r');
};

const addGoodToNomCard = (value, barcode) => {
  nomCard = rightColumn.getNomenklature();

  let goodId = stor.operationTradeCurrentGoodId;

  let currGoods = (stor.operationTradeIsFind === 'true') ? dataFind : dataGoods;

  let goodIndex = searchGoodById(currGoods, goodId);
  let nomIndex = searchGoodById(nomCard, goodId);

  if (!barcode) {

    if (dataStore.property_list) {
      let perm = tools.serachElements({
        'array': dataStore.property_list,
        'el': '11',
        'strict': true
      });

      if (perm === 'none') {
        if (value < 0) {
          markupTools.informationtModal = {
            'title': 'ОШИБКА',
            'message': 'Запрещены отрицательные остатки'
          };
          return false;
        }
      }
    } else {
      if (value < 0) {
        markupTools.informationtModal = {
          'title': 'ОШИБКА',
          'message': 'Запрещены отрицательные остатки'
        };
        return false;
      }
    }
  }

  if (!nomCard) {
    nomCard = [];
  }

  // let goodOldCount = (stor.operationTradeCurrentGoodCount !== 'undefined') ? stor.operationTradeCurrentGoodCount : 'none';
  // let oldCount;
  // if (goodIndex !== 'none') {
  //   // currGoods[goodIndex].count = Number(currGoods[goodIndex].count) - Number(value);
  //   oldCount = (!barcode) ? currGoods[goodIndex].count : 'null';
  //   currGoods[goodIndex].count = value;

  // } else if (nomIndex !== 'none') {
  //   oldCount = (!barcode) ? value - stor.operationTradeCurrentGoodCount :
  //     'none';
  // } else {
  //   oldCount = 'none';
  // }

  if (nomIndex === 'none') {
    nomCard.push({
      'id': stor.operationTradeCurrentGoodId,
      'name': stor.operationTradeCurrentGoodName,
      'count': value,
      'oldCount': stor.operationTradeCurrentGoodCount,
      'newRow': true
    });
  } else {
    // nomCard[nomIndex].id = stor.operationTradeCurrentGoodId;
    // nomCard[nomIndex].name = stor.operationTradeCurrentGoodName;
    nomCard[nomIndex].count = value;
    nomCard[nomIndex].newRow = true;
    // nomCard[nomIndex].curCount = stor.operationTradeCurrentGoodCount;
  }

  if (goodIndex !== 'none') {
    if (stor.operationTradeIsFind === 'true') {
      dataFind[goodIndex].count = value;
    } else {
      currGoods[goodIndex].count = value;
    }
  }

  redrawColumn();
  inventoryFormSubmit.disabled = false;
  return true;
};

const remGoodFromNomCard = () => {
  let id = stor.operationTradeCurrentGoodId;
  let numIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = nomCard[numIndex].oldCount;
  }

  nomCard.splice(numIndex, 1);

  if ((nomCard.length === 0) || (nomCard.length === 1 && nomCard[0].discount)) {
    inventoryFormSubmit.disabled = true;
  }

  redrawColumn();
};

const addLeftFormCallback = (count) => {
  addGoodToNomCard(count);
};

const addRightFormCallback = (count) => {
  if (count !== 0) {
    addGoodToNomCard(count);
  } else {
    remGoodFromNomCard();
  }
};

const clickLeftGoodsCallback = () => {
  switch (stor.operationClickType) {
  case 'card':
    stor.currentGoodId = stor.operationTradeCurrentGoodId;
    goodCard.fill();
    break;
  case 'def':
    operationsTradeAdd.show(addLeftFormCallback, 'l');
    break;
  }
};

const clickLeftFindToBarcodeCallack = () => {
  stor.operationTradeIsFind = true;
  switch (stor.operationClickType) {
  case 'card':
    stor.currentGoodId = stor.operationTradeCurrentGoodId;
    goodCard.fill();
    break;
  case 'def':
    operationsTradeAdd.show(addLeftFormCallback, 'l');
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
        data[index].count -= el.count;
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
  appHeader.setStocksList(dataStore.all_stocks);
  // appHeader.setKontragentList(dataStore.all_kontr_agents);
  leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback);
  focusBarcode();
};

const sendInventoryForm = () => {
  submitSpinner.innerHTML = markupTools.getLoadSpinner('sp-1', 'Отправка');
  serverTools.sendDataToServer({
    'stock': inventoryFormStock.value,
    'kontragent': 0,
    'data': nomCard
  }, tradeSubmitFormCallback);
};

const addHandlers = () => {

  $(modalAdd).on('shown.bs.modal', function () {
    $(modalAddCount).trigger('focus');
  });

  $(modalDiscount).on('shown.bs.modal', function () {
    $(modalDiscountCount).trigger('focus');
  });

  document.querySelector('#list-inventory-list').addEventListener('click', () => {
    stor.operationTradeType = 7;
    rightColumn.clear();
    leftColumnNode.innerHTML = markupTools.getLoadSpinner('sp-2', 'Загрузка');
    serverTools.getDataFromServer(stor.data.currentStock, getDataCallback);
  });

  document.querySelector('#operations-inventory-clear-but').addEventListener('click', () => {
    leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    rightColumn.clear();
    inventoryFormSubmit.disabled = true;
  });

  document.querySelector('body').addEventListener('keydown', (evt) => {
    if (evt.altKey && evt.code === 'Enter') {
      evt.preventDefault();

      if (listInventory.classList.contains('active') && !inventoryFormSubmit.disabled) {
        sendInventoryForm();
      }
    }
  }, true);

  inventoryFormStock.addEventListener('change', () => {
    stor.operationTradeDiscount = 0;
    leftColumn.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    rightColumn.clear();
    inventoryFormSubmit.disabled = true;
  });

  inventoryForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    sendInventoryForm();
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
      leftColumn.drawHeader('find', clichButtonBackCallback);
      leftColumn.message('Товар не найден!');
      return false;
    }

    if (dataFind.length === 1) {
      stor.operationTradeCurrentGoodCount = dataFind[0].count;
      stor.operationTradeCurrentGoodName = dataFind[0].name;
      stor.operationTradeCurrentGoodId = dataFind[0].id;

      operationsTradeAdd.show(addLeftFormCallback, 'l');
      return true;
    }

    stor.operationTradeIsFind = true;
    stor.operationTradeCurrentOpen = 'goods';
    leftColumn.drawFind(dataFind, clickLeftFindToBarcodeCallack, clichButtonBackCallback, 'goods');
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
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
