import stor from './../tools/storage.js';
import operationsTradeServer from './operations__trade--server-tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';


// Операции: 0 - закупка, 1 - продажа, 7 инвентаризация
const stocksList = document.querySelector('#operations-purchase-stocks-list');
const goodAddForm = document.querySelector('#operations-trade-add');


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
  console.log('clickRightGoodsCallback');
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

const formAddCallback = (count) => {
  addNomCard(count);
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
    operationsTradeAdd.show(goodAddForm, formAddCallback);
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
