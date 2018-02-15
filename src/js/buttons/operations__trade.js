import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import markupTools from './../markup/tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';

// import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
// const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');

let dataStore;
let cycleCount;
let goods = []; // товары в группе
let nakladnaya = []; // массив с данными временной накладной

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

const getGoods = () => {
  let currGrp = stor.currentGroupId;

  let filterArray = goods.filter((el) => {
    if (el.groupId === currGrp) {
      return true;
    }
    return false;
  });

  if (filterArray) {
    operationsTradeLeft.drawGoods(filterArray, clickGoodsLeftCallback, headerButtonBackClickHandler);
  } else {
    markupTools.informationtModal({
      'title': 'СООБЩЕНИЕ',
      'message': 'Группа пустая',
      'isMess': true
    });
  }
};

const clickGroupsCallback = () => {
  getGoods();
};

const getGoodsXhrCallbackSuccess = (response) => {
  // Выводим товары в группе

  response.data.forEach((el) => {
    goods.push(el);
    goods[goods.length - 1].groupId = dataStore.all_groups[cycleCount].id;
  });

  cycleCount++;

  if (cycleCount < dataStore.all_groups.length) {
    getGoodsFromServer();
  } else {
    console.dir(goods);
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, headerButtonBackClickHandler);
  }
};

const getGoodsFromServer = () => {

  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;
  let grpId = dataStore.all_groups[cycleCount].id;

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/stock/${stocksList.value}/group/${grpId}/goods`,
    'metod': 'POST',
    'data': `operation=${oper}&token=${cred.token}`,
    'callbackSuccess': getGoodsXhrCallbackSuccess
  };
};

const initGetGoodsFromServer = () => {
  cycleCount = 0;
  goods = [];
  getGoodsFromServer();
};

const getDataXhrCallbackSuccess = (response) => {
  console.dir(response);
  dataStore = response.data;

  operationsTradeHeader.setStocksList(dataStore.all_stocks);
  operationsTradeRight.setKontragentList(dataStore.all_kontr_agents);

  initGetGoodsFromServer();
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
