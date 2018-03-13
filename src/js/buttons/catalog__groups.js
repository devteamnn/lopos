import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import search from './universal-search.js';
import groupDelete from './catalog__groups--delete.js';
import groupsAdd from './catalog__groups--add.js';
import goodsCard from './catalog__goods.js';
import groupsList from './universal-groups-list.js';
import uValid from './universal-validity-micro.js';

const groupsEditForm = document.querySelector('#groups-edit');
const groupsEditName = document.querySelector('#groups-edit-name');
const groupsEditMarkup = document.querySelector('#groups-edit-markup');
const groupsEditSubmit = document.querySelector('#groups-edit-submit');

const listGroups = document.querySelector('#list-groups-list');
const listGroupsCardAddBtn = document.querySelector('#list-groups-card-add-btn');
const listGroupsCardDeleteBtn = document.querySelector('#groups-edit-delete');
const listGroupsCard = document.querySelector('#list-groups-card');
const listGroupsCardBody = document.querySelector('#list-groups-card-body');
const groupsAddModal = document.querySelector('#groups-add');
const groupGoodsCard = document.querySelector('#group-goods-card');
const groupName = document.querySelector('#group-name');


const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);


// ############################## РАБОТА С ГРУППАМИ (СПИСОК) ##############################

let loadedData = [];

// поиск по группам
const listGroupSearchInput = document.querySelector('#list-groups-search-input');
listGroupSearchInput.addEventListener('input', (evt) => {
  groupsList.drawCatalog(search.make(loadedData.data, evt.target.value), listGroupsCardBody, onGroupClick);
});

listGroupsCardAddBtn.addEventListener('click', () => {
  groupsAdd.start(groupsAddModal);
});

// обработка успеха загрузки групп
const onSuccessGroupsLoad = (loadedGroups) => {
  loadedData = loadedGroups;
  console.log(loadedData);
  document.querySelector(`#${loaderSpinnerId}`).remove();
  groupsList.drawCatalog(loadedGroups.data, listGroupsCardBody, onGroupClick);
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


const getGoodsForGroup = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: goodsCard.onSuccessGroupGood,
  };
};

listGroupsCardDeleteBtn.addEventListener('click', groupDelete.make);


const onGroupsEditSubmit = (evt) => {
  evt.preventDefault();
  if (uValid.check([groupsEditName, groupsEditMarkup]/* , ['balance-amount', 'balance-set-describe'] */)) {
    xhr.request = {
      metod: 'PUT',
      url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}`,
      data: `markup=${groupsEditMarkup.value}&name=${groupsEditName.value}&token=${auth.data.token}`,
      callbackSuccess: getGroups,
    };
    $(groupsEditForm).modal('hide');

  }
};

groupsEditSubmit.addEventListener('click', onGroupsEditSubmit);
groupsEditForm.addEventListener('submit', onGroupsEditSubmit);

const onGroupsEditNameMarkup = () => {
  if (groupsEditName.value === auth.currentGroupName && +groupsEditMarkup.value === +auth.currentGroupMarkup) {
    groupsEditSubmit.setAttribute('disabled', 'disabled');
  } else {
    groupsEditSubmit.removeAttribute('disabled');
  }
};


groupsEditName.addEventListener('input', onGroupsEditNameMarkup);
groupsEditMarkup.addEventListener('input', onGroupsEditNameMarkup);

// обработчик клика по ноде группы
const onGroupClick = (evt) => {

  if (evt.target.tagName === 'BUTTON') {
    $(groupsEditForm).modal('show');
    groupsEditName.value = auth.currentGroupName;
    groupsEditMarkup.value = auth.currentGroupMarkup;
    if (auth.currentGroupCount === '0') {
      listGroupsCardDeleteBtn.removeAttribute('disabled');
    } else {
      listGroupsCardDeleteBtn.setAttribute('disabled', 'disabled');
    }
    onGroupsEditNameMarkup();
    // groupEdit.start(groupsEditForm);

  // } else if (auth.groupListOperationType === 'open' || !auth.groupListOperationType) {
  } else {
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
