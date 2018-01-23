import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import enterprisesButton from './reference-enterprises.js';

const appUrl = window.appSettings.formAddEnterprise.UrlApi;
const messages = window.appSettings.formAddEnterprise.message;

const validPattern = window.appSettings.formAddEnterprise.validPatterns;
const validMessage = window.appSettings.formAddEnterprise.validMessage;


const body = document.querySelector('body');
const enterprisesAdd = body.querySelector('#enterprises-add');
const form = enterprisesAdd.querySelector('#enterprises-add-form');

const name = form.querySelector('#enterprise-name');
const balance = form.querySelector('#enterprise-balance');
const currency = form.querySelector('#enterprise-money');

const spinner = form.querySelector('#enterprises-add-spinner');

const buttonSubmit = form.querySelector('#enterprises-add-submit');
const buttonCancel = form.querySelector('#enterprises-add-cancel');

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
    input.classList.remove('border');
    input.classList.remove('border-danger');
    input.nextElementSibling.innerHTML = '';
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
  $('#enterprises-add').modal('hide');

  switch (response.status) {
  case 200:
    enterprisesButton.redraw();
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
  $('#enterprises-card-edit').modal('hide');

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
  if (!validPattern.balance.test(balance.value)) {
    valid = false;
    showAlert(balance);
  }

  return valid;
};

const submitForm = () => {
  const stor = dataStorage.data;
  let postData = `name=${name.value}&balance=${balance.value}&currency=${currency.value}&token=${stor.token}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);

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

  $('#enterprises-add').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#enterprises-add').on('shown.bs.modal', () => {
    window.appFormCurrValue = {
      'name': name.value,
    };
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
