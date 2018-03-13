import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import debitCreditAddEditU from './reference__debit-credit--add-edit-u.js';

const debitList = document.querySelector('#list-debit-list');
const creditList = document.querySelector('#list-credit-list');
const debitCreditBody = document.querySelector('#list-debit-credit-card-body');

const debitCreditIcon = document.querySelector('#list-debit-credit-icon');
const debitCreditTitle = document.querySelector('#list-debit-credit-title');

const debitCreditAddBtn = document.querySelector('#list-debit-credit-card-add-btn');
const debitCreditEditBtn = document.querySelector('#list-debit-credit-card-edit-btn');
const debitCreditDeleteBtn = document.querySelector('#list-debit-credit-card-delete-btn');
const universalAdd = document.querySelector('#universal-add');

const loaderSpinnerId = 'loader-groups';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

const enableCheckEditButtons = () => {
  debitCreditEditBtn.removeAttribute('disabled');
  debitCreditDeleteBtn.removeAttribute('disabled');
};

const disableCheckEditButtons = () => {
  debitCreditEditBtn.setAttribute('disabled', 'disabled');
  debitCreditDeleteBtn.setAttribute('disabled', 'disabled');
};

// ############################## РАЗМЕТКА ##############################
const getElement = (item, index) => {

  return `
    <input type="radio" id="reference-${item.id}"  data-debit-credit-id="${item.id}" data-debit-credit-name="${item.name}" class="d-none">

    <label class="reference-header" for="reference-${item.id}" data-debit-credit-id="${item.id}" data-debit-credit-name="${item.name}">
        <div class="reference-column">${index + 1}</div>
        <div class="reference-column">${item.name}</div>
    </label>
`;

  /*
  return `
  <input type="radio" id="reference-${item.id}"  data-debit-credit-id="${item.id}" data-debit-credit-name="${item.name}" class="d-none">
  <label style="padding-left: 34px;" for="reference-${item.id}" class="d-flex justify-content-between align-items-center reference-string" data-debit-credit-id="${item.id}" data-debit-credit-name="${item.name}">
    <div><span class="reference-row-number">${index + 1}</span> ${item.name}</div>
    <div class="d-flex justify-content-between align-items-center">
    </div>
  </label>`;
  */
};

const drawDataInContainer = (enterprisesData) => {
  debitCreditBody.innerHTML = `
    <div class="reference-header">
        <div class="reference-column">№</div>
        <div class="reference-column">Категория</div>
    </div>`;
  enterprisesData.forEach((item, index) => debitCreditBody.insertAdjacentHTML('beforeend', getElement(item, index)));
};

// ############################## ЗАПРОС НА УДАЛЕНИЕ ##############################
const onSuccessdebitCreditDelete = (answer) => {
  console.log(answer);

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: `Категория <b>${auth.debitCreditName}</b> успешно удалено`
  };
  getdebitCredit();
};

const setRequestToDeletedebitCredit = () => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/reason/${auth.debitCreditId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessdebitCreditDelete,
  };
};

debitCreditDeleteBtn.addEventListener('click', function () {

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить категорию <b>${auth.debitCreditName}</b>?`,
    submitCallback: setRequestToDeletedebitCredit
  };

});
// ############################## НАСТРОЙКА УНИВЕРСАЛЬНОЙ ФОРМЫ ДОБАВЛЕНИЯ ##############################
const setupUniversalAdd = () => {
  auth.currentCardName = '';
  toolsMarkup.runUniversalAdd = {
    title: 'Создание категории',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    submitBtnName: 'Создать',
  };
  debitCreditAddEditU.start(universalAdd, 'add');
};

const setupUniversalAddEdit = () => {
  toolsMarkup.runUniversalAdd = {
    title: 'Редактирование категории',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    inputValue: auth.debitCreditName,
    submitBtnName: 'Изменить',
  };
  debitCreditAddEditU.start(universalAdd, 'edit');
};

debitCreditAddBtn.addEventListener('click', setupUniversalAdd);
debitCreditEditBtn.addEventListener('click', setupUniversalAddEdit);

// ############################## РАБОТА С ГРУППАМИ (СПИСОК) ##############################

let selectedString = '';

debitCreditBody.addEventListener('change', function (evt) {
  console.log(evt);
  if (selectedString) {
    selectedString.classList.remove('bg-light');
  }
  selectedString = (evt.target.labels) ? evt.target.labels[0] : evt.target;
  selectedString.classList.add('bg-light');
  auth.debitCreditId = selectedString.dataset.debitCreditId;
  auth.debitCreditName = selectedString.dataset.debitCreditName;
  enableCheckEditButtons();
});

const onSuccessdebitCreditLoad = (debitCreditData) => {
  console.log(debitCreditData);
  document.querySelector(`#${loaderSpinnerId}`).remove();
  drawDataInContainer(debitCreditData.data);
  disableCheckEditButtons();
};


const getdebitCredit = () => {

  debitCreditBody.innerHTML = '';
  debitCreditBody.insertAdjacentHTML('beforeend', loaderSpinnerMarkup);

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/reason/${auth.debitCreditType}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessdebitCreditLoad,
  };
};

const initDebit = () => {
  auth.debitCreditType = 'debit';
  debitCreditIcon.src = 'img/revenue.png';
  debitCreditTitle.innerHTML = 'Категории доходов';
  getdebitCredit();
};

const initCredit = () => {
  auth.debitCreditType = 'credit';
  debitCreditIcon.src = 'img/expenses.png';
  debitCreditTitle.innerHTML = 'Категории расходов';
  getdebitCredit();
};

export default {

  start() {
    debitList.addEventListener('click', initDebit);
    creditList.addEventListener('click', initCredit);
  },

  redraw: getdebitCredit,

  stop() {
    // groupsMarkup.cleanContainer();
    debitList.removeEventListener('click', initDebit);
    creditList.removeEventListener('click', initCredit);
  }
};
