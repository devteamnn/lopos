import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import groupsMarkup from '../markup/catalog-groups.js';
import toolsMarkup from '../markup/tools.js';
import goodsCard from './catalog-groups-goods.js';

const listGroups = document.querySelector('#list-groups-list');
// const listGroupsCardAddBtn = document.querySelector('#list-groups-card-add-btn');
const listGroupsCardDeleteBtn = document.querySelector('#list-groups-card-delete-btn');
const listGroupsCardEditBtn = document.querySelector('#list-groups-card-edit-btn');
const listGroupsCard = document.querySelector('#list-groups-card');
const listGroupsCardBody = document.querySelector('#list-groups-card-body');
const listGroupsCardCheckMessage = document.querySelector('#list-groups-header-check-message');
const groupsEditForm = document.querySelector('#groups-edit');
const groupsEditName = document.querySelector('#groups-edit-name');
const groupGoodsCard = document.querySelector('#group-goods-card');
const groupGoodsReturnBtn = document.querySelector('#group-goods-return-btn');
const groupGoodsViewBtn = document.querySelector('#group-goods-view-btn');
const groupName = document.querySelector('#group-name');

const goodsSortModal = document.querySelector('#group-goods-sort');
const goodsSortAbcUpBtn = document.querySelector('#group-goods-sort-abc-up');
const goodsSortAbcDownBtn = document.querySelector('#group-goods-sort-abc-down');
const goodsSortTailingsUpBtn = document.querySelector('#group-goods-sort-tailings-up');
const goodsSortTailingsDownBtn = document.querySelector('#group-goods-sort-tailings-down');

const groupGoodsCardBody = document.querySelector('#group-goods-card-body');

const SELECT_DELAY = 2000;

const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);
let loadedData = [];
let loadedGoods = [];
let currentGroupName = '';

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

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить группу <b>${loadedData.data[currentStringElement.dataset.groupIndex].name}</b>?`,
    submitCallback: setRequestToDeleteGroup.bind(null, currentStringElement.dataset.groupId)
  };

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

listGroupsCardEditBtn.addEventListener('click', onListGroupsCardEditBtnClick);
listGroupsCardDeleteBtn.addEventListener('click', onListGroupsCardDeleteBtnClick);

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
  auth.goodsViewMode = (auth.goodsViewMode === 'null') ? 'string' : auth.goodsViewMode;
  drawGoods();
};

const onListGroupsCardBodyClick = (evt) => {
  groupGoodsCard.classList.remove('d-none');
  listGroupsCard.classList.add('d-none');

  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.groupId) {
    currentStringElement = currentStringElement.parentNode;
  }

  currentGroupName = loadedData.data[currentStringElement.dataset.groupIndex].name;
  groupName.innerHTML = currentGroupName;

  auth.currentGroupId = currentStringElement.dataset.groupId;
  auth.currentGroupName = currentGroupName;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${currentStringElement.dataset.groupId}/goods`,
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

goodsSortAbcUpBtn.addEventListener('click', function () {
  loadedGoods.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
  drawGoods();
  $(goodsSortModal).modal('hide');
});

goodsSortAbcDownBtn.addEventListener('click', function () {
  loadedGoods.data.sort((a, b) => (b.name > a.name) ? 1 : -1);
  drawGoods();
  $(goodsSortModal).modal('hide');
});

goodsSortTailingsUpBtn.addEventListener('click', function () {
  loadedGoods.data.sort((a, b) => a.count - b.count);
  drawGoods();
  $(goodsSortModal).modal('hide');
});

goodsSortTailingsDownBtn.addEventListener('click', function () {
  loadedGoods.data.sort((a, b) => b.count - a.count);
  drawGoods();
  $(goodsSortModal).modal('hide');
});

const onGroupGoodsCardBodyClick = (evt) => {
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.goodId) {
    currentStringElement = currentStringElement.parentNode;
  }
  goodsCard.fill(currentStringElement.dataset.goodId);
};

groupGoodsCardBody.addEventListener('click', onGroupGoodsCardBodyClick);

export default {

  start() {
    listGroups.addEventListener('click', getGroups);
  },

  redraw: getGroups,

  stop() {
    groupsMarkup.cleanContainer();
    listGroups.removeEventListener('click', getGroups);
  }
};
