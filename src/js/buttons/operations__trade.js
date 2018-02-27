import stor from './../tools/storage.js';
import tools from './../tools/tools.js';
import operationsTradeServer from './operations--server-tools.js';
import operationsTradeLeft from './operations--left-column.js';
import operationsTradeRight from './operations--right-column.js';
import operationsTradeHeader from './operations--header.js';
import operationsTradeAdd from './operations--good-add.js';
import operationsTradeDiscount from './operations__trade--discount.js';

import goodCard from './catalog__goods.js';
import markupTools from './../markup/tools.js';

const searchBarcodeForm = document.querySelector('#operations-trade-search-barcode-form');
const searchForm = document.querySelector('#operations-trade-search');
const tradeForm = document.querySelector('#operation-trade-form');

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
      // operationsTradeLeft.drawGroups(dataFind, clickGroupsCallback);
      operationsTradeLeft.drawFind(dataFind, clickGroupsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
      break;
    case 'goods':
      // operationsTradeLeft.drawGoods(dataFind, clickLeftGoodsCallback, clichButtonBackCallback);
      operationsTradeLeft.drawFind(dataFind, clickLeftGoodsCallback, clichButtonBackCallback, stor.operationTradeCurrentOpen);
      break;
    }
  } else {
    switch (stor.operationTradeCurrentOpen) {
    case 'groups':
      operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
      break;
    case 'goods':
      operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
      break;
    }
  }

  operationsTradeRight.drawPrice(calcNumSum());
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
};

const tradeSubmitFormCallback = () => {
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
  operationsTradeRight.clear();
};

const clickGroupsCallback = () => {
  operationsTradeServer.getGoodsFromServer(stor.currentGroupId, tradeForm.stock.value, getGoodsCallback);
};

const clichButtonBackCallback = () => {
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
};

const clickRightGoodsCallback = () => {
  if (stor.operationTradeRightClickType !== 'false') {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  } else {
    operationsTradeAdd.show(addRightFormCallback, 'r');
  }
};

const discountCallback = (discValue) => {
  if (discValue === 0) {
    remDiscountFromNomCard();
  } else {
    addDiscountToNomCard(discValue);
  }
};

const calcOldCount = (value, count) => {
  let oldCount;

  switch (stor.operationTradeType) {
  case '0':
    oldCount = count + value;
    break;
  case '1':
    oldCount = count - value;
    break;
  }

  return oldCount;
};

const addGoodToNomCard = (value, barcode) => {
  nomCard = operationsTradeRight.getNomenklature();

  let goodId = stor.operationTradeCurrentGoodId;

  let goodIndex = searchGoodById(dataGoods, goodId);
  let nomIndex = searchGoodById(nomCard, goodId);

  if (!barcode && stor.operationTradeType !== '0') {
    let count;

    if (goodIndex !== 'none') {
      count = dataGoods[goodIndex].count;
    } else {
      if (nomIndex !== 'none') {
        count = nomCard[nomIndex].oldCount;
      } else {
        console.log('что-то пошло не так....');
      }

    }

    if (dataStore.property_list) {
      let perm = tools.serachElements({
        'array': dataStore.property_list,
        'el': '11',
        'strict': true
      });

      if (perm === 'none') {
        if (value > count) {
          markupTools.informationtModal = {
            'title': 'ОШИБКА',
            'message': `Товара "${stor.operationTradeCurrentGoodName}"" нет на складе!`
          };
          return false;
        }
      }
    } else {
      if (value > count) {
        markupTools.informationtModal = {
          'title': 'ОШИБКА',
          'message': `Товара "${stor.operationTradeCurrentGoodName}"" нет на складе!`
        };
        return false;
      }
    }
  }

  if (!nomCard) {
    nomCard = [];
  }

  // let goodOldCount = (stor.operationTradeCurrentGoodCount !== 'undefined') ? stor.operationTradeCurrentGoodCount : 'none';
  let oldCount;
  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = (stor.operationTradeType === '0') ?
      Number(dataGoods[goodIndex].count) + Number(value) :
      Number(dataGoods[goodIndex].count) - Number(value);

    oldCount = (!barcode) ? dataGoods[goodIndex].count : 'null';
  } else if (nomIndex !== 'none') {
    oldCount = (!barcode) ? calcOldCount(value, stor.operationTradeCurrentGoodCount) :
      'none';
  } else {
    oldCount = 'none';
  }

  if (nomIndex === 'none') {
    nomCard.push({
      'id': stor.operationTradeCurrentGoodId,
      'name': stor.operationTradeCurrentGoodName,
      'price': stor.operationTradeCurrentGoodPrice,
      'count': value,
      'oldCount': oldCount
    });
  } else {
    nomCard[nomIndex].count = Number(nomCard[nomIndex].count) + value;
    nomCard[nomIndex].oldCount = oldCount;
    nomCard[nomIndex].price = stor.operationTradeCurrentGoodPrice;
  }

  calcDiscount();
  redrawColumn();
  tradeForm.submit.disabled = false;
  return true;
};

const addDiscountToNomCard = (precent) => {
  calcDiscount(precent);
  stor.operationTradeDiscount = precent;
  operationsTradeRight.drawPrice(calcNumSum());
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
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

const calcDiscount = (value) => {
  let indexFromNum = searchGoodById(nomCard, dataStore.discount_id);

  if (indexFromNum !== 'none' || value) {
    let numSum = calcNumSum(true);
    let precent = (value) ? value : nomCard[indexFromNum].discount;

    if (indexFromNum === 'none') {
      nomCard.push({
        'id': dataStore.discount_id,
        'name': 'СКИДКА',
        'price': Number(numSum / 100 * precent).toFixed(2),
        'count': -1,
        'discount': precent
      });
    } else {
      nomCard[indexFromNum].price = Number(numSum / 100 * precent).toFixed(2);
      nomCard[indexFromNum].discount = precent;
    }
  }
};

const remGoodFromNomCard = () => {
  let id = stor.operationTradeCurrentGoodId;
  let nomIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = (stor.operationTradeType === '0') ?
      Number(dataGoods[goodIndex].count) - Number(nomCard[nomIndex].count) :
      Number(dataGoods[goodIndex].count) + Number(nomCard[nomIndex].count);
  }

  nomCard.splice(nomIndex, 1);

  if ((nomCard.length === 0) || (nomCard.length === 1 && nomCard[0].discount)) {
    tradeForm.submit.disabled = true;
  }

  calcDiscount();
  redrawColumn();

};

const setCountGoodToNomCard = (value) => {
  nomCard = operationsTradeRight.getNomenklature();

  let goodIndex = searchGoodById(dataGoods, stor.operationTradeCurrentGoodId);
  let nomIndex = searchGoodById(nomCard, stor.operationTradeCurrentGoodId);

  let goodCount = nomCard[nomIndex].count;
  let oldCount = (goodIndex !== 'none') ? dataGoods[goodIndex].count :
    nomCard[nomIndex].oldCount;


  if (dataStore.property_list) {
    if (stor.operationTradeType !== '0') {
      let perm = tools.serachElements({
        'array': dataStore.property_list,
        'el': '11',
        'strict': true
      });
      if (perm === 'none' && oldCount && oldCount !== 'none') {
        if ((value - Number(nomCard[nomIndex].count)) > oldCount) {
          markupTools.informationtModal = {
            'title': 'ОШИБКА',
            'message': `Товара "${stor.operationTradeCurrentGoodName}"" нет на складе!`
          };
          return false;
        }
      }
    }
  } else {
    if ((value - Number(nomCard[nomIndex].count)) > oldCount) {
      markupTools.informationtModal = {
        'title': 'ОШИБКА',
        'message': `Товара "${stor.operationTradeCurrentGoodName}"" нет на складе!`
      };
      return false;
    }
  }

  let delta = goodCount - value;
  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count = (stor.operationTradeType === '0') ? dataGoods[goodIndex].count - delta :
      dataGoods[goodIndex].count + delta;

    goodCount = dataGoods[goodIndex].count;
  } else {
    nomCard[nomIndex].oldCount = (stor.operationTradeType === '0') ?
      nomCard[nomIndex].oldCount - delta
      : nomCard[nomIndex].oldCount + delta;
  }


  nomCard[nomIndex].count = value;
  nomCard[nomIndex].oldCount = goodCount;

  calcDiscount();
  redrawColumn();
  tradeForm.submit.disabled = false;
  return true;
};

const remDiscountFromNomCard = () => {

  let index = searchGoodById(nomCard, dataStore.discount_id);

  nomCard.splice(index, 1);

  calcDiscount();
  stor.operationTradeDiscount = 0;

  redrawColumn();

};

const addLeftFormCallback = (count) => {
  addGoodToNomCard(count);
};

const addRightFormCallback = (count) => {
  if (count !== 0) {
    setCountGoodToNomCard(count);
  } else {
    remGoodFromNomCard();
  }
};

const clickLeftGoodsCallback = () => {
  switch (stor.operationClickType) {
  case 'add':
    addGoodToNomCard(1);
    break;
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
  case 'add':
    addGoodToNomCard(1, true);
    break;
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
  nomCard = operationsTradeRight.getNomenklature();

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
  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
};

const getDataCallback = (data) => {
  dataStore = data;
  console.dir(dataStore);
  operationsTradeHeader.setStocksList(dataStore.all_stocks);
  operationsTradeRight.setKontragentList(dataStore.all_kontr_agents);
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);

};

const getData = () => {
  operationsTradeServer.getDataFromServer(stor.data.currentStock, getDataCallback);
};

const initWindow = () => {
  operationsTradeHeader.setHeader();
  operationsTradeRight.clear();
};

const init = (type) => {
  stor.operationTradeType = type;
  stor.operationTradeDiscount = 0;
  initWindow();
  getData();
};

const addHandlers = () => {

  document.querySelector('#list-receipt-list').addEventListener('click', () => {
    init(0);
  });

  document.querySelector('#list-sell-list').addEventListener('click', () => {
    init(1);
  });

  document.querySelector('#operations-trade-discountBtn').addEventListener('click', () => {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  });

  document.querySelector('#operations-trade-clear-but').addEventListener('click', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });

  tradeForm.stock.addEventListener('change', () => {
    // stor.operationTradeDiscount = 0;
    // operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
    init(stor.operationTradeType);
  });

  tradeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let form = evt.target;
    operationsTradeServer.sendDataToServer({
      'stock': form.stock.value,
      'kontragent': form.kontragents.value,
      'delivery': (form.delivery.checked) ? 1 : 0,
      'data': nomCard
    }, tradeSubmitFormCallback, dataStore.discount_id);
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
      operationsTradeLeft.drawHeader('find', clichButtonBackCallback);
      operationsTradeLeft.message('Товар не найден!');
      return false;
    }

    if (dataFind.length === 1) {
      stor.operationTradeCurrentGoodId = dataFind[0].id;
      stor.operationTradeCurrentGoodName = dataFind[0].name;
      stor.operationTradeCurrentGoodCount = dataFind[0].count;
      stor.operationTradeCurrentGoodPrice = dataFind[0].price;

      addGoodToNomCard(1, true);
      return true;
    }
    stor.operationTradeIsFind = true;
    stor.operationTradeCurrentOpen = 'goods';
    operationsTradeLeft.drawFind(dataFind, clickLeftFindToBarcodeCallack, clichButtonBackCallback, 'goods');
    return true;
  });

  searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let elName = evt.target.name.value;

    if (!elName) {
      operationsTradeLeft.drawHeader('find', clichButtonBackCallback);
      switch (stor.operationTradeCurrentOpen) {
      case 'groups':
        operationsTradeLeft.message('Группа не найдена!');
        break;
      case 'goods':
        operationsTradeLeft.message('Товар не найден!');
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
      operationsTradeLeft.drawHeader('find', clichButtonBackCallback);

      switch (stor.operationTradeCurrentOpen) {
      case 'groups':
        operationsTradeLeft.message('Группа не найдена!');
        break;
      case 'goods':
        operationsTradeLeft.message('Товар не найден!');
        break;
      }

      return false;
    }

    operationsTradeLeft.drawFind(dataFind, callback, clichButtonBackCallback, stor.operationTradeCurrentOpen);

    return true;
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
