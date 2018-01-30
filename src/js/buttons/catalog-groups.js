import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import groupsMarkup from '../markup/catalog-groups.js';
import toolsMarkup from '../markup/tools.js';
import goodsCard from './catalog-groups-goods.js';

const listGroups = document.querySelector('#list-groups-list');
const listGroupsCardAddBtn = document.querySelector('#list-groups-card-add-btn');
const listGroupsCardDeleteBtn = document.querySelector('#list-groups-card-delete-btn');
const listGroupsCardEditBtn = document.querySelector('#list-groups-card-edit-btn');
const listGroupGoodsAddModal = document.querySelector('#group-goods-add');
const listGroupGoodsAddModalName = document.querySelector('#group-goods-name');
const listGroupGoodsAddModalDescribe = document.querySelector('#group-goods-describe');
const listGroupGoodsAddModalPurchase = document.querySelector('#group-goods-price-purchase');
const listGroupGoodsAddModalSell = document.querySelector('#group-goods-price-sell');
const listGroupGoodsAddModalBarcode = document.querySelector('#group-goods-barcode');
const listGroupGoodsCardCopyBtn = document.querySelector('#group-goods-copy-btn');
const listGroupsCard = document.querySelector('#list-groups-card');
const listGroupsCardBody = document.querySelector('#list-groups-card-body');
const listGroupsCardCheckMessage = document.querySelector('#list-groups-header-check-message');
const listGroupsGoodsCardCheckMessage = document.querySelector('#list-groups-goods-header-check-message');
const groupsEditForm = document.querySelector('#groups-edit');
const groupsEditName = document.querySelector('#groups-edit-name');
const groupGoodsCard = document.querySelector('#group-goods-card');
const groupGoodsReturnBtn = document.querySelector('#group-goods-return-btn');
const groupGoodsViewBtn = document.querySelector('#group-goods-view-btn');
const groupGoodsAddSubmitBtn = document.querySelector('#group-goods-add-submit');
const groupGoodsAddLabel = document.querySelector('#group-goods-add-label');
const groupName = document.querySelector('#group-name');

const goodsSortModal = document.querySelector('#group-goods-sort');
const goodsSortAbcUpBtn = document.querySelector('#group-goods-sort-abc-up');
const goodsSortAbcDownBtn = document.querySelector('#group-goods-sort-abc-down');
const goodsSortTailingsUpBtn = document.querySelector('#group-goods-sort-tailings-up');
const goodsSortTailingsDownBtn = document.querySelector('#group-goods-sort-tailings-down');

const groupGoodsCardBody = document.querySelector('#group-goods-card-body');

const listGroupSearchInput = document.querySelector('#list-groups-search-input');

const SELECT_DELAY = 2000;

const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);
let loadedData = [];
let loadedGoods = [];
let currentGroupName = '';

listGroupSearchInput.addEventListener('input', (evt) => {
  console.log(evt);
  let selectedData = [];
  loadedData.data.forEach((item) => {
    if (item.name.toLowerCase().indexOf(listGroupSearchInput.value.toLowerCase()) !== -1) {
      selectedData.push(item);
    }
  });
  groupsMarkup.cleanContainer();
  groupsMarkup.drawDataInContainer(selectedData);

});

const onSuccessGroupDelete = (answer) => {

  // onListEnterprisesCardReturnBtn();
  console.log(answer);
  let message = '';

  if (answer.status === 271) {
    message = answer.message + ', удалить никак невозможно-с';
  } else {
    message = 'Группа успешно удалена';
    getGroups();
  }

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message
  };

};

const setRequestToDeleteGroup = (groupNumber) => {
  console.log(`lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${groupNumber}`);
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${groupNumber}`,
    data: `token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupDelete,
  };
};


const onListGroupsCardBodyClickEdit = (evt) => {
  console.log(evt.target);
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.groupIndex) {
    currentStringElement = currentStringElement.parentNode;
  }
  $(groupsEditForm).modal('show');
  groupsEditName.value = loadedData.data[currentStringElement.dataset.groupIndex].name;

  auth.currentGroupId = loadedData.data[currentStringElement.dataset.groupIndex].id;
  auth.currentGroupName = loadedData.data[currentStringElement.dataset.groupIndex].name;
};

const onListGroupsCardBodyClickRemove = (evt, clickedAction) => {
  console.log(evt.target);
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.groupIndex) {
    currentStringElement = currentStringElement.parentNode;
  }
  console.log(currentStringElement.dataset.groupIndex);
  console.log(currentStringElement.dataset.groupLevel);
  auth.currentGroupId = loadedData.data[currentStringElement.dataset.groupIndex].id;

  if (+currentStringElement.dataset.groupLevel >= 9000) {
    toolsMarkup.informationtModal = {
      title: 'Уведомление',
      message: '<b>NO! IT\'S OVER NINE THOUSAAAAAND!!!</b>'
    };
  } else {
    toolsMarkup.actionRequestModal = {
      title: 'Удаление',
      message: `Вы точно хотите удалить группу <b>${loadedData.data[currentStringElement.dataset.groupIndex].name}</b>?`,
      submitCallback: setRequestToDeleteGroup.bind(null, currentStringElement.dataset.groupId)
    };
  }

  groupsEditName.value = loadedData.data[currentStringElement.dataset.groupIndex].name;
};


const onSuccessGroupsLoad = (loadedGroups) => {
  console.log(loadedGroups);
  loadedData = loadedGroups;
  document.querySelector(`#${loaderSpinnerId}`).remove();
  groupsMarkup.drawDataInContainer(loadedGroups.data);
};

const getGroups = () => {
  groupsMarkup.cleanContainer();
  groupsMarkup.drawMarkupInContainer(loaderSpinnerMarkup);
  auth.currentGroupId = false;


  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupsLoad,
  };
};

const onListGroupsCardEditBtnClick = (evt) => {
  listGroupsCardCheckMessage.innerHTML = 'Выберите группу';
  listGroupsCardBody.removeEventListener('click', onListGroupsCardBodyClick);
  listGroupsCardBody.addEventListener('click', onListGroupsCardBodyClickEdit);
  window.setTimeout(function () {
    listGroupsCardCheckMessage.innerHTML = '';
    listGroupsCardBody.addEventListener('click', onListGroupsCardBodyClick);
    listGroupsCardBody.removeEventListener('click', onListGroupsCardBodyClickEdit);
  }, SELECT_DELAY);
};

const onListGroupsCardDeleteBtnClick = (evt) => {

  listGroupsCardBody.removeEventListener('click', onListGroupsCardBodyClick);
  listGroupsCardCheckMessage.innerHTML = 'Выберите группу';
  listGroupsCardBody.addEventListener('click', onListGroupsCardBodyClickRemove);

  window.setTimeout(function () {
    listGroupsCardCheckMessage.innerHTML = '';
    listGroupsCardBody.addEventListener('click', onListGroupsCardBodyClick);
    listGroupsCardBody.removeEventListener('click', onListGroupsCardBodyClickRemove);

  }, SELECT_DELAY);
};

const fillCopyCard = (loadedGoodData) => {
  let {
    name,
    description,
    barcode,
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
  } = loadedGoodData.data;
  purchasePrice = Number(purchasePrice).toFixed(2);
  sellingPrice = Number(sellingPrice).toFixed(2);
  listGroupGoodsAddModalName.value = name;
  listGroupGoodsAddModalDescribe.value = description;
  listGroupGoodsAddModalPurchase.value = +purchasePrice;
  listGroupGoodsAddModalSell.value = +sellingPrice;
  listGroupGoodsAddModalBarcode.value = barcode;
};

const onListGroupGoodsCardCopy = (evt) => {
  $(listGroupGoodsAddModal).modal('show');
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.goodId) {
    currentStringElement = currentStringElement.parentNode;
  }
  auth.currentGoodId = currentStringElement.dataset.goodId;
  goodsCard.fill(fillCopyCard);
};

const onListGroupGoodsCardCopyBtn = (evt) => {

  listGroupsGoodsCardCheckMessage.innerHTML = 'Выберите товар';
  groupGoodsAddSubmitBtn.innerHTML = 'Скопировать';
  groupGoodsAddLabel.innerHTML = 'Копирование товара';
  groupGoodsCardBody.removeEventListener('click', onGroupGoodsCardBodyClick);
  groupGoodsCardBody.addEventListener('click', onListGroupGoodsCardCopy);
  window.setTimeout(function () {
    listGroupsGoodsCardCheckMessage.innerHTML = '';
    groupGoodsCardBody.addEventListener('click', onGroupGoodsCardBodyClick);
    groupGoodsCardBody.removeEventListener('click', onListGroupGoodsCardCopy);
  }, SELECT_DELAY);
};
listGroupsCardAddBtn.addEventListener('click', () => {
  groupGoodsAddSubmitBtn.innerHTML = 'Создание';
  groupGoodsAddLabel.innerHTML = 'Создание товара';
});
listGroupsCardEditBtn.addEventListener('click', onListGroupsCardEditBtnClick);
listGroupsCardDeleteBtn.addEventListener('click', onListGroupsCardDeleteBtnClick);
listGroupGoodsCardCopyBtn.addEventListener('click', onListGroupGoodsCardCopyBtn);

const drawGoods = () => {
  if (auth.goodsViewMode === 'string') {
    groupsMarkup.drawGoodsTable(loadedGoods.data);
  } else if (auth.goodsViewMode === 'metro') {
    groupsMarkup.drawGoodsMetro(loadedGoods.data);
  }
};

const onSuccessGroupGood = (goodsData) => {
  console.log(goodsData);
  loadedGoods = goodsData;
  if (auth.goodsSortMode && loadedGoods.data) {
    goodsSortMode[auth.goodsSortMode]();
  }
  auth.goodsViewMode = (auth.goodsViewMode === 'null') ? 'string' : auth.goodsViewMode;
  drawGoods();
};

const onListGroupsCardBodyClick = (evt) => {
  groupGoodsCard.classList.remove('d-none');
  listGroupsCard.classList.add('d-none');

  if (evt) {
    let currentStringElement = evt.target;
    while (!currentStringElement.dataset.groupId) {
      currentStringElement = currentStringElement.parentNode;
    }

    currentGroupName = loadedData.data[currentStringElement.dataset.groupIndex].name;
    groupName.innerHTML = currentGroupName;

    auth.currentGroupId = currentStringElement.dataset.groupId;
    auth.currentGroupName = currentGroupName;
  }

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupGood,
  };


};

const onGroupGoodsReturnBtnClick = () => {
  groupGoodsCard.classList.add('d-none');
  listGroupsCard.classList.remove('d-none');
};

const onGroupGoodsViewBtnClick = () => {
  if (auth.goodsViewMode === 'string') {
    groupsMarkup.drawGoodsMetro(loadedGoods.data);
    auth.goodsViewMode = 'metro';
  } else if (auth.goodsViewMode === 'metro') {
    groupsMarkup.drawGoodsTable(loadedGoods.data);
    auth.goodsViewMode = 'string';
  }
};

listGroupsCardBody.addEventListener('click', onListGroupsCardBodyClick);
groupGoodsReturnBtn.addEventListener('click', onGroupGoodsReturnBtnClick);

groupGoodsViewBtn.addEventListener('click', onGroupGoodsViewBtnClick);

const onGoodsSortAbcUpBtn = () => {
  loadedGoods.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
  drawGoods();
  $(goodsSortModal).modal('hide');
  auth.goodsSortMode = 'abcUp';
};

const onGoodsSortAbcDownBtn = () => {
  loadedGoods.data.sort((a, b) => (b.name > a.name) ? 1 : -1);
  drawGoods();
  $(goodsSortModal).modal('hide');
  auth.goodsSortMode = 'abcDown';
};

const onGoodsSortTailingsUpBtn = () => {
  loadedGoods.data.sort((a, b) => a.count - b.count);
  drawGoods();
  $(goodsSortModal).modal('hide');
  auth.goodsSortMode = 'sortTailingsUp';
};

const onGoodsSortTailingsDownBtn = () => {
  loadedGoods.data.sort((a, b) => b.count - a.count);
  drawGoods();
  $(goodsSortModal).modal('hide');
  auth.goodsSortMode = 'sortTailingsDown';
};


goodsSortAbcUpBtn.addEventListener('click', onGoodsSortAbcUpBtn);
goodsSortAbcDownBtn.addEventListener('click', onGoodsSortAbcDownBtn);
goodsSortTailingsUpBtn.addEventListener('click', onGoodsSortTailingsUpBtn);
goodsSortTailingsDownBtn.addEventListener('click', onGoodsSortTailingsDownBtn);

const goodsSortMode = {
  abcUp: onGoodsSortAbcUpBtn,
  abcDown: onGoodsSortAbcDownBtn,
  sortTailingsUp: onGoodsSortTailingsUpBtn,
  sortTailingsDown: onGoodsSortTailingsDownBtn
};

const onGroupGoodsCardBodyClick = (evt) => {
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.goodId) {
    currentStringElement = currentStringElement.parentNode;
  }
  auth.currentGoodId = currentStringElement.dataset.goodId;
  goodsCard.fill();
};

groupGoodsCardBody.addEventListener('click', onGroupGoodsCardBodyClick);

export default {

  start() {
    listGroups.addEventListener('click', getGroups);
  },

  redraw: getGroups,
  redrawGoods: onListGroupsCardBodyClick,

  stop() {
    groupsMarkup.cleanContainer();
    listGroups.removeEventListener('click', getGroups);
  }
};
