import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import keywordsButton from './reference-keywords.js';

const appUrl = window.appSettings.formAddKeywords.UrlApi;
const validPattern = window.appSettings.formAddKeywords.validPatterns;
const validMessage = window.appSettings.formAddKeywords.validMessage;
const messages = window.appSettings.formAddKeywords.messages;


const body = document.querySelector('body');
const enterprisesAdd = body.querySelector('#keywords-add');
const form = enterprisesAdd.querySelector('#keywords-add-form');

const name = form.querySelector('#keywords-add-name');

const spinner = form.querySelector('#keywords-add-spinner');

const buttonSubmit = form.querySelector('#keywords-add-submit');
const buttonCancel = form.querySelector('#keywords-add-cancel');

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
  $('#keywords-add').modal('hide');

  switch (response.status) {
  case 200:
    keywordsButton.update();
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
  $('#keywords-add').modal('hide');

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
  const stor = dataStorage.data;
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

  $('#keywords-add').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#keywords-add').on('shown.bs.modal', () => {
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
