import stor from './../tools/storage.js';
import operationsTradeServer from './operations__trade--server-tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';
import operationsTradeDiscount from './operations__trade--discount.js';

const searchBarcodeForm = document.querySelector('#operations-trade-search-barcode-form');
const tradeForm = document.querySelector('#operation-trade-form');

let dataStore = [];
let dataGoods = [];
let nomCard = []; // номенклатура

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

const serachElements = (array, property, el) => {
  let indexes = [];

  array.forEach((good) => {
    if (good[property] === el) {
      indexes.push(good);
    }
  });

  if (indexes.length === 0) {
    return 'none';
  }
  return indexes;

};

const redrawColumn = () => {
  switch (stor.operationTradeCurrentOpen) {
  case 'folder':
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
    break;
  case 'goods':
    operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
    break;
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

const addGoodToNomCard = (value) => {
  let goodId = stor.operationTradeCurrentGoodId;
  let goodIndex = searchGoodById(dataGoods, goodId);

  if (goodIndex !== 'none') {
    dataGoods[goodIndex].count -= value;
  }

  nomCard = operationsTradeRight.getNomenklature();

  let numIndex = searchGoodById(nomCard, goodId);

  if (!nomCard) {
    nomCard = [];
  }

  // if (!nomCard) {
  //   nomCard = [];
  //   nomCard.push({
  //     'id': stor.operationTradeCurrentGoodId,
  //     'name': stor.operationTradeCurrentGoodName,
  //     'price': stor.operationTradeCurrentGoodPrice,
  //     'count': value,
  //     'oldCount': stor.operationTradeCurrentGoodCount
  //   });
  // } else if (numIndex === 'none') {
  //   nomCard.push({
  //     'id': dataGoods[goodIndex].id,
  //     'name': dataGoods[goodIndex].name,
  //     'price': dataGoods[goodIndex].price,
  //     'count': value,
  //     'oldCount': dataGoods[goodIndex].count
  //   });
  // } else {
  //   nomCard[numIndex].count = Number(nomCard[numIndex].count) + value;
  //   nomCard[numIndex].oldCount = Number(nomCard[numIndex].oldCount) - value;
  // }

  let goodOldCount = (stor.operationTradeCurrentGoodCount !== 'undefined') ? stor.operationTradeCurrentGoodCount : 'none';

  if (numIndex === 'none') {
    nomCard.push({
      'id': stor.operationTradeCurrentGoodId,
      'name': stor.operationTradeCurrentGoodName,
      'price': stor.operationTradeCurrentGoodPrice,
      'count': value,
      'oldCount': goodOldCount
    });
  } else {
    goodOldCount = nomCard[numIndex].oldCount;

    if (goodOldCount !== 'none') {
      goodOldCount -= Number(nomCard[numIndex].oldCount) - value;
    }

    nomCard[numIndex].count = Number(nomCard[numIndex].count) + value;
    nomCard[numIndex].oldCount = goodOldCount;
  }

  calcDiscount();
  redrawColumn();
  tradeForm.submit.disabled = false;
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
  let numIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  dataGoods[goodIndex].count = Number(dataGoods[goodIndex].count) + Number(nomCard[numIndex].count);

  nomCard.splice(numIndex, 1);

  if ((nomCard.length === 0) || (nomCard.length === 1 && nomCard[0].discount)) {
    tradeForm.submit.disabled = true;
  }

  calcDiscount();
  redrawColumn();

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
    addGoodToNomCard(count);
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
    console.log('-CARD-');
    break;
  case 'def':
    operationsTradeAdd.show(addLeftFormCallback, 'l');
    break;
  }
};

const clickLeftFindToBarcodeCallack = () => {
  switch (stor.operationClickType) {
  case 'add':
    addGoodToNomCard(1);
    break;
  case 'card':
    console.log('-CARD-');
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
        data[index].count -= el.count;
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

  document.querySelector('#list-inventory-list').addEventListener('click', () => {
    init(7);
  });

  document.querySelector('#operations-trade-discountBtn').addEventListener('click', () => {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  });

  document.querySelector('#operations-trade-clear-but').addEventListener('click', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });

  tradeForm.stock.addEventListener('change', () => {
    stor.operationTradeDiscount = 0;
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });

  tradeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let form = evt.target;
    operationsTradeServer.sendDataToServer({
      'stock': form.stock.value,
      'kontragent': form.kontragents.value,
      'delivery': (form.delivery.checked) ? 1 : 0,
      'data': nomCard
    }, tradeSubmitFormCallback);
  });

  searchBarcodeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let goods = serachElements(dataStore.all_goods_with_barcode, 'barcode', evt.target.barcode.value);

    if (goods !== 'none') {
      operationsTradeLeft.drawFind(goods, clickLeftFindToBarcodeCallack, clichButtonBackCallback);
    }

    console.log('нет совпадений');
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
