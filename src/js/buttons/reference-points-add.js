import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import pointButton from './reference-points.js';

const appUrl = window.appSettings.formAddPoint.UrlApi;

const validPattern = window.appSettings.formAddPoint.validPatterns;
const validMessage = window.appSettings.formAddPoint.validMessage;

const messages = window.appSettings.formAddPoint.messages;


const body = document.querySelector('body');
const enterprisesAdd = body.querySelector('#points-add');
const form = enterprisesAdd.querySelector('#points-add-form');

const name = form.querySelector('#points-add-name');

const spinner = form.querySelector('#points-add-spinner');

const buttonSubmit = form.querySelector('#points-add-submit');
const buttonCancel = form.querySelector('#points-add-cancel');

const stor = dataStorage.data;

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
  $('#points-add').modal('hide');

  switch (response.status) {
  case 200:
    pointButton.redraw();
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
  $('#points-add').modal('hide');

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

  return valid;
};

const submitForm = () => {
  let postData = `name=${name.value}&token=${stor.token}`;
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

  $('#points-add').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#points-add').on('shown.bs.modal', () => {
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
