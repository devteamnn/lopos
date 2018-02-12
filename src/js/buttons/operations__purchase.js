import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import universalGroupsList from './universal-groups-list.js';
import universalGoodsList from './universal-goods-list.js';

// const operationsPurchase = document.querySelector('#operations-purchase');
const stocksList = document.querySelector('#operations-purchase-stocks-list');
const kontragentsList = document.querySelector('#operations-purchase-kontragents-list');
const leftColumn = document.querySelector('#operations-purchase-left');


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

const universalGroupsListCallback = () => {
  getGroups();
};

const setGroupList = (groups) => {
  universalGroupsList.draw(groups, leftColumn, universalGroupsListCallback);
};

const getDataXhrCallbackSuccess = (response) => {
  console.dir(response);
  setstocksList(response.data.all_stocks);
  setKontragentList(response.data.all_kontr_agents);
  setGroupList(response.data.all_groups);
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

const universalGoodsListCallback = () => {

};

const getGroupsXhrCallbackSuccess = (response) => {
  // Выводим товары в группе
  leftColumn.innerHTML = '';
  universalGoodsList.draw(response.data, leftColumn, universalGoodsListCallback);

  // leftColumn.innerHTML = '';
  // response.data.forEach((el) => {
  //   leftColumn.innerHTML = leftColumn.innerHTML + `<div>${el.id} || ${el.name} || ${el.count}</div>`;
  // });
};

const getGroups = () => {
  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/stock/${stocksList.value}/group/${stor.currentGroupId}/goods`,
    'metod': 'POST',
    'data': `operation=${oper}&token=${cred.token}`,
    'callbackSuccess': getGroupsXhrCallbackSuccess
  };
};

export default {
  start() {
    console.dir(getData());
  }
};
