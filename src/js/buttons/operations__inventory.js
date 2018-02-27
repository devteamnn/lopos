import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import search from './universal-search.js';

import groupsList from './universal-groups-list.js';
import goodsList from './universal-goods-list.js';


const listInventory = document.querySelector('#list-inventory-list');
const inventoryStocks = document.querySelector('#inventory-stocks');

// const listGroupsCard = document.querySelector('#list-groups-card');
const inventoryGroups = document.querySelector('#inventory-groups');
const inventoryGroupsBody = document.querySelector('#inventory-groups-body');
const inventoryGoods = document.querySelector('#inventory-goods');
const inventoryGoodsBody = document.querySelector('#inventory-goods-body');

const inventoryGoodsReturnBtn = document.querySelector('#inventory-goods-return-btn');
const inventoryGroupName = document.querySelector('#inventory-group-name');
// const groupGoodsCard = document.querySelector('#group-goods-card');


const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);


// ############################## РАБОТА С ГРУППАМИ (СПИСОК) ##############################

let loadedGroups = [];
let loadedGoods = [];

// поиск по группам
const listGroupSearchInput = document.querySelector('#list-groups-search-input');
listGroupSearchInput.addEventListener('input', (evt) => {
  groupsList.draw(search.make(loadedGroups, evt.target.value), inventoryGroupsBody, onGroupClick);
});

// кнопка возврата на список групп
const onInventoryGoodsReturnBtnlick = () => {
  inventoryGoods.classList.add('d-none');
  inventoryGroups.classList.remove('d-none');
  // groups.redraw();
};
inventoryGoodsReturnBtn.addEventListener('click', onInventoryGoodsReturnBtnlick);

// обработка успеха загрузки групп
const onSuccessDataLoad = (loadedData) => {
  console.log(loadedData);
  loadedGroups = loadedData.data.all_groups;
  document.querySelector(`#${loaderSpinnerId}`).remove();

  groupsList.draw(loadedGroups, inventoryGroupsBody, onGroupClick);
  inventoryStocks.innerHTML = loadedData.data.all_stocks.map((item) => `<option value="${item.id}" ${(item.id === auth.data.currentStock) ? 'selected' : ''}>${item.name}</option>`).join('');

};

// получение групп
const getData = () => {
  inventoryGroupsBody.innerHTML = '';
  inventoryGroupsBody.insertAdjacentHTML('beforeend', loaderSpinnerMarkup);
  auth.currentGroupId = false;
  auth.currentStockId = auth.data.currentStock;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/operation/inventory`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessDataLoad,
  };
};

const onSuccessGroupGood = (goodsData) => {
  loadedGoods = goodsData.data;
  /*
  if (auth.goodsSortMode && loadedGoods.data) {
    universalSort(auth.goodsSortMode);
  }
  */
  // auth.goodsViewMode = (auth.goodsViewMode === 'null') ? 'string' : auth.goodsViewMode;
  console.log(loadedGoods);
  goodsList.draw(loadedGoods, inventoryGoodsBody, null);
};

const getGoodsForGroup = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupGood,
  };
};

// обработчик клика по ноде группы
const onGroupClick = () => {
  inventoryGroupName.innerHTML = auth.currentGroupName;
  inventoryGoods.classList.remove('d-none');
  inventoryGroups.classList.add('d-none');
  getGoodsForGroup();
};


export default {

  start() {
    listInventory.addEventListener('click', getData);
  },

  // redraw: getData,
  // getGoodsForGroup,

  stop() {
    // groupsMarkup.cleanContainer();
    listInventory.removeEventListener('click', getData);
  }
};
