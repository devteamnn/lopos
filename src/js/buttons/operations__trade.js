import stor from './../tools/storage.js';
import operationsTradeServer from './operations__trade--server-tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';
import operationsTradeDiscount from './operations__trade--discount.js';


// Операции: 0 - закупка, 1 - продажа, 7 инвентаризация
const stocksList = document.querySelector('#operations-purchase-stocks-list');

let dataStore;
let dataGoods;
let nomCard; // номенклатура

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

const clickGroupsCallback = () => {
  operationsTradeServer.getGoodsFromServer(stor.currentGroupId, stocksList.value, getGoodsCallback);
};

const clichButtonBackCallback = () => {
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
};

const clickRightGoodsCallback = () => {
  operationsTradeAdd.show(addRightFormCallback, 'r');
};

const discountCallback = (discValue) => {
  console.log('discount OK');
};

const addNomCard = (value) => {
  let goodId = stor.operationTradeCurrentGoodId;
  let goodIndex = searchGoodById(dataGoods, goodId);

  dataGoods[goodIndex].count -= value;

  nomCard = operationsTradeRight.getNomenklature();

  let numIndex = searchGoodById(nomCard, goodId);

  if (!nomCard) {
    nomCard = [];
    nomCard.push({
      'id': dataGoods[goodIndex].id,
      'name': dataGoods[goodIndex].name,
      'price': dataGoods[goodIndex].price,
      'count': value,
      'oldCount': dataGoods[goodIndex].count
    });
  } else if (numIndex === 'none') {
    nomCard.push({
      'id': dataGoods[goodIndex].id,
      'name': dataGoods[goodIndex].name,
      'price': dataGoods[goodIndex].price,
      'count': value,
      'oldCount': dataGoods[goodIndex].count
    });
  } else {
    nomCard[numIndex].count = Number(nomCard[numIndex].count) + value;
    nomCard[numIndex].oldCount = Number(nomCard[numIndex].oldCount) - value;
  }

  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
};

const remGoodFromNomCard = () => {
  let id = stor.operationTradeCurrentGoodId;
  let numIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  dataGoods[goodIndex].count = Number(dataGoods[goodIndex].count) + Number(nomCard[numIndex].count);

  nomCard.splice(numIndex, 1);

  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
};

const addLeftFormCallback = (count) => {
  addNomCard(count);
};

const addRightFormCallback = (count) => {
  if (count !== 0) {
    addNomCard(count);
  } else {
    remGoodFromNomCard();
  }
};

const clickLeftGoodsCallback = () => {
  switch (stor.operationClickType) {
  case 'add':
    addNomCard(1);
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

const addHandlers = () => {
  document.querySelector('#list-receipt-list').addEventListener('click', () => {
    stor.operationTradeType = 0;
    initWindow();
    getData();
  });

  document.querySelector('#list-sell-list').addEventListener('click', () => {
    stor.operationTradeType = 1;
    initWindow();
    getData();
  });

  document.querySelector('#list-inventory-list').addEventListener('click', () => {
    stor.operationTradeType = 7;
    initWindow();
    getData();
  });

  document.querySelector('#operations-trade-discountBtn').addEventListener('click', () => {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  });

  document.querySelector('#operations-trade-clear-but').addEventListener('click', () => {
    operationsTradeRight.clear();
  });

  stocksList.addEventListener('change', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
