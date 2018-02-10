import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import search from './universal-search.js';
import groupDelete from './catalog__groups--delete.js';
import groupsAdd from './catalog__groups--add.js';
import goodsCard from './catalog__goods.js';
import groupsList from './universal-groups-list.js';
import groupEdit from './catalog__groups--edit.js';

const groupsEditForm = document.querySelector('#groups-edit');
const groupsEditName = document.querySelector('#groups-edit-name');

const listGroups = document.querySelector('#list-groups-list');
const listGroupsCardAddBtn = document.querySelector('#list-groups-card-add-btn');
const listGroupsCardDeleteBtn = document.querySelector('#list-groups-card-delete-btn');
const listGroupsCardEditBtn = document.querySelector('#list-groups-card-edit-btn');
const listGroupsCard = document.querySelector('#list-groups-card');
const listGroupsCardBody = document.querySelector('#list-groups-card-body');
const listGroupsCardCheckMessage = document.querySelector('#list-groups-header-check-message');
const groupsAddModal = document.querySelector('#groups-add');
const groupGoodsCard = document.querySelector('#group-goods-card');
const groupName = document.querySelector('#group-name');

const SELECT_DELAY = 2000;

const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);


// ############################## РАБОТА С ГРУППАМИ (СПИСОК) ##############################

let loadedData = [];

// поиск по группам
const listGroupSearchInput = document.querySelector('#list-groups-search-input');
listGroupSearchInput.addEventListener('input', (evt) => {
  groupsList.draw(search.make(loadedData.data, evt.target.value), listGroupsCardBody, onGroupClick);
});

listGroupsCardAddBtn.addEventListener('click', () => {
  groupsAdd.start(groupsAddModal);
});

// обработка успеха загрузки групп
const onSuccessGroupsLoad = (loadedGroups) => {
  loadedData = loadedGroups;
  document.querySelector(`#${loaderSpinnerId}`).remove();
  groupsList.draw(loadedGroups.data, listGroupsCardBody, onGroupClick);
};

// получение групп
const getGroups = () => {
  listGroupsCardBody.innerHTML = '';
  listGroupsCardBody.insertAdjacentHTML('beforeend', loaderSpinnerMarkup);
  auth.currentGroupId = false;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupsLoad,
  };
};

// обработчики кликов редактирования/удаления
const onEditDeleteClick = (evt) => {
  auth.groupListOperationType = (evt.target === listGroupsCardEditBtn) ? 'edit' : 'delete';
  listGroupsCardCheckMessage.innerHTML = 'Выберите группу';

  window.setTimeout(function () {
    listGroupsCardCheckMessage.innerHTML = '';
    auth.groupListOperationType = 'open';
  }, SELECT_DELAY);
};
listGroupsCardEditBtn.addEventListener('click', onEditDeleteClick);
listGroupsCardDeleteBtn.addEventListener('click', onEditDeleteClick);

const getGoodsForGroup = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: goodsCard.onSuccessGroupGood,
  };
};

// обработчик клика по ноде группы
const onGroupClick = () => {

  if (auth.groupListOperationType === 'edit') {
    $(groupsEditForm).modal('show');
    groupsEditName.value = auth.currentGroupName;
    groupEdit.start(groupsEditForm);

  } else if (auth.groupListOperationType === 'delete') {
    groupDelete.make();

  } else if (auth.groupListOperationType === 'open' || !auth.groupListOperationType) {
    groupName.innerHTML = auth.currentGroupName;
    groupGoodsCard.classList.remove('d-none');
    listGroupsCard.classList.add('d-none');
    // getGoodsForGroup();
    goodsCard.redraw();
  }
};

$('#list-groups-search-input').focus();

$('#groups-add').on('shown.bs.modal', function () {
  $('#groups-add-name').trigger('focus');
});

$('#groups-edit').on('shown.bs.modal', function () {
  $('#groups-edit-name').trigger('focus');
});

$('#add-resources-modal').on('shown.bs.modal', function () {
  $('#add-resources-modal-quantity').trigger('focus');
});

$('#points-edit').on('shown.bs.modal', function () {
  $('#points-edit-name').trigger('focus');
});

$('#points-add').on('shown.bs.modal', function () {
  $('#points-add-name').trigger('focus');
});

$('#keywords-add').on('shown.bs.modal', function () {
  $('#keywords-add-name').trigger('focus');
});

export default {

  start() {
    listGroups.addEventListener('click', getGroups);
  },

  redraw: getGroups,
  getGoodsForGroup,

  stop() {
    // groupsMarkup.cleanContainer();
    listGroups.removeEventListener('click', getGroups);
  }
};
