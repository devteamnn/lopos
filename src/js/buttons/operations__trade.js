import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import operationsTradeLeft from './operations__trade--left-column.js';

// import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');

let dataStore;


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
  console.log('button back OK!');
  operationsTradeLeft.drawGroups(dataStore.all_groups, drawGroupsCallback, headerButtonBackClickHandler);
};

const drawGoodsCallback = (type) => {
  switch (type) {
  case 'add':
    console.log('Добавить в накладную');
    break;
  case 'card':
    console.log('Открыть карту');
    break;
  }
};

const getGoodsXhrCallbackSuccess = (response) => {
  // Выводим товары в группе
  console.dir(response);
  operationsTradeLeft.drawGoods(response.data, drawGoodsCallback, headerButtonBackClickHandler);
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

const drawGroupsCallback = () => {
  getGoods();
};

// const setGroupList = (groups) => {
//   universalGroupsList.draw(groups, leftColumn, universalGroupsListCallback);
// };

const getDataXhrCallbackSuccess = (response) => {
  console.dir(response);
  dataStore = response.data;
  setstocksList(response.data.all_stocks);
  setKontragentList(response.data.all_kontr_agents);
  operationsTradeLeft.drawGroups(dataStore.all_groups, drawGroupsCallback, headerButtonBackClickHandler);
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

// const universalGoodsListCallback = () => {

// };

// export default {
//   start() {
//     operationsTradeLeft.start();
//     // !!Здесь инициализировать переменные и обработчики
//     operationsTradeLeft.header();
//     getData();
//   }
// };

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    operationsTradeLeft.start();
    getData();
  }
};
