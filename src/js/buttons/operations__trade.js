import stor from './../tools/storage.js';
import operationsTradeServer from './operations__trade--server-tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
// import operationsTradeAdd from './operations__trade--good-add.js';

// import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
// const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');

let dataStore;
let dataGoods;
let nomCard; // номенклатура

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

  // console.dir(operationsTradeRight.getNomenklature());
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
  }

  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
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
    console.log('<-------DEF<-----------');
    break;
  }
};

const getGoodsCallback = (data) => {
  dataGoods = data;
  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
};

const getDataCallback = (data) => {
  dataStore = data;

  operationsTradeHeader.setStocksList(dataStore.all_stocks);
  operationsTradeRight.setKontragentList(dataStore.all_kontr_agents);
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);

};

const getData = () => {
  operationsTradeServer.getDataFromServer(stor.data.currentStock, getDataCallback);
};

const addHandlers = () => {
  document.querySelector('#list-receipt-list').addEventListener('click', () => {
    stor.operationTradeType = 1;
    operationsTradeHeader.setHeader();
    getData();
  });

  document.querySelector('#list-sell-list').addEventListener('click', () => {
    stor.operationTradeType = -1;
    operationsTradeHeader.setHeader();
    getData();
  });

  document.querySelector('#operations-trade-clear-but').addEventListener('click', () => {
    operationsTradeRight.clear();
  });

  stocksList.addEventListener('change', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, headerButtonBackClickHandler);
    operationsTradeRight.clear();
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
