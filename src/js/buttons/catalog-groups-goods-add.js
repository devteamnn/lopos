import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroups from './catalog-groups.js';

const appUrl = window.appSettings.formAddGoods.UrlApi;
const messages = window.appSettings.formAddGoods.message;

const validPattern = window.appSettings.formAddGoods.validPatterns;
const validMessage = window.appSettings.formAddGoods.validMessage;


const body = document.querySelector('body');
const groupGoodsAdd = body.querySelector('#group-goods-add');
const form = groupGoodsAdd.querySelector('#group-goods-add-form');

const name = form.querySelector('#group-goods-name');
const describe = form.querySelector('#group-goods-describe');
const group = form.querySelector('#group-goods-group');
const purchase = form.querySelector('#group-goods-price-purchase');
const extra = form.querySelector('#group-goods-price-extra');
const sell = form.querySelector('#group-goods-price-sell');
const barcode = form.querySelector('#group-goods-barcode');

const spinner = form.querySelector('#group-goods-add-spinner');
const priceValid = form.querySelector('#group-goods-price-valid');

const buttonSubmit = form.querySelector('#group-goods-add-submit');
const buttonCancel = form.querySelector('#group-goods-add-cancel');

const showSpinner = () => {
  spinner.classList.remove('invisible');
  buttonSubmit.disabled = true;
  buttonCancel.disabled = true;
};

const hideSpinner = () => {
  spinner.classList.add('invisible');
  buttonSubmit.disabled = false;
  buttonCancel.disabled = false;
};

const showAlert = (input) => {
  if (input.type === 'text') {
    input.classList.add('border');
    input.classList.add('border-danger');
    input.nextElementSibling.innerHTML = validMessage[input.id.match(/[\w]+$/)];
  }
};

const hideAlert = (input) => {
  if (input.type === 'text') {
    switch (input.id) {
    case 'group-goods-price-purchase': priceValid.innerHTML = ''; break;
    case 'group-goods-price-extra': priceValid.innerHTML = ''; break;
    case 'group-goods-price-sell': priceValid.innerHTML = ''; break;
    default: input.nextElementSibling.innerHTML = ''; break;
    }

    input.classList.remove('border');
    input.classList.remove('border-danger');
  }
};

const formReset = () => {
  form.reset();

  hideAlert(name);

  hideSpinner();

  buttonSubmit.disabled = true;
  buttonCancel.disabled = false;
};

const callbackXhrSuccess = (response) => {

  hideSpinner();
  formReset();
  $('#group-goods-add').modal('hide');

  switch (response.status) {
  case 200:
    catalogGroups.redrawGoods();
    break;
  case 400:
    markup.informationtModal = {
      'title': 'Error',
      'messages': messages.mes400
    };
    break;
  case 271:
    markup.informationtModal = {
      'title': 'Error',
      'messages': response.messages
    };
    break;
  }
};

const callbackXhrError = () => {
  hideSpinner();
  formReset();
  $('#group-goods-add').modal('hide');

  markup.informationtModal = {
    'title': 'Error',
    'messages': window.appSettings.messagess.xhrError
  };
};

const validateForm = () => {
  let valid = true;

  if (!validPattern.name.test(name.value)) {
    valid = false;
    showAlert(name);
  }

  if (!validPattern.description.test(describe.value)) {
    valid = false;
    showAlert(describe);
  }

  if (!validPattern.group.test(group.value)) {
    valid = false;
    showAlert(group);
  }
  if (!validPattern.purchasePrice.test(purchase.value)) {
    valid = false;
    priceValid.innerHTML = '!!';
  }
  if (!validPattern.extra.test(extra.value)) {
    valid = false;
    priceValid.innerHTML = '!!';
  }
  if (!validPattern.sellingPrice.test(sell.value)) {
    valid = false;
    priceValid.innerHTML = '!!';
  }
  if (!validPattern.barcode.test(barcode.value)) {
    valid = false;
    showAlert(barcode);
  }
  return valid;
};

const submitForm = () => {
  const stor = dataStorage.data;
  const groupId = dataStorage.currentGroupId;

  let postData = `token=${stor.token}&name=${name.value}&description=${describe.value}&purchase_price=${purchase.value}&selling_price=${sell.value}&group=${groupId}&barcode=${barcode.value}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);

  let response = {
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };

  xhr.request = response;
};

const formSubmitHandler = (evt) => {
  evt.preventDefault();

  if (validateForm()) {
    showSpinner();
    submitForm();
  }
};

const addHandlers = () => {

  $('#group-goods-add').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#group-goods-add').on('shown.bs.modal', () => {
    group.value = dataStorage.currentGroupName;
  });

  form.addEventListener('input', (evt) => {
    hideAlert(evt.target);
    buttonSubmit.disabled = false;
  });

  form.addEventListener('submit', formSubmitHandler);
};

export default {
  start: addHandlers
};
