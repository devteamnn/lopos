import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';

// import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
// const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');

let dataStore;
let nakladnaya = [];

const headerButtonBackClickHandler = () => {
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, headerButtonBackClickHandler);
};

// const addGoodForNakladnaya = () => {

// };

const clickGoodsRightCallback = () => {
  console.log('clickGoodsRightCallback');
};

const clickGoodsLeftCallback = (type) => {
  switch (stor.operationClickType) {
  case 'add':
    operationsTradeRight.drawGoods(nakladnaya, clickGoodsRightCallback);
    break;
  case 'card':break;
  case 'def':
    operationsTradeAdd.show();
    break;
  }

};

const getGoodsXhrCallbackSuccess = (response) => {
  // Выводим товары в группе
  console.dir(response);

  nakladnaya = response.data; // !!!ДЛЯ ТЕСТА!!!

  operationsTradeLeft.drawGoods(response.data, clickGoodsLeftCallback, headerButtonBackClickHandler);
};

const getGoods = () => {
  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/stock/${stocksList.value}/group/${stor.currentGroupId}/goods`,
    'metod': 'POST',
    'data': `operation=${oper}&token=${cred.token}`,
    'callbackSuccess': getGoodsXhrCallbackSuccess
  };
};

const clickGroupsCallback = () => {

  getGoods();
};

const getDataXhrCallbackSuccess = (response) => {
  console.dir(response);
  dataStore = response.data;
  operationsTradeHeader.setStocksList(dataStore.all_stocks);
  operationsTradeRight.setKontragentList(response.data.all_kontr_agents);
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, headerButtonBackClickHandler);
};

const getData = () => {
  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/operation/${oper}`,
    'metod': 'POST',
    'data': `token=${cred.token}`,
    'callbackSuccess': getDataXhrCallbackSuccess
  };
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
