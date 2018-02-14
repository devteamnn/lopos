import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';

// import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');
const clearBut = document.querySelector('#operations-trade-clear-but');

let dataStore;
let nakladnaya = [];


const setstocksList = (stocks) => {
  stocks.forEach((el) => {
    stocksList.innerHTML = stocksList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
  });
};

const setKontragentList = (kontragents) => {
  kontragents.forEach((el) => {
    kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
  });
};

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
    $('#operations-trade-add').modal('show');
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
  setstocksList(response.data.all_stocks);
  setKontragentList(response.data.all_kontr_agents);
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
  clearBut.addEventListener('click', () => {
    operationsTradeRight.clear();
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    operationsTradeLeft.start();
    operationsTradeRight.start();
    addHandlers();
    getData();
  }
};
