import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import keywordsButton from './reference-keywords.js';

const appUrl = window.appSettings.formEditKeywords.UrlApi;

const messages = window.appSettings.formEditKeywords.messages;

const validPattern = window.appSettings.formEditKeywords.validPatterns;
const validMessage = window.appSettings.formEditKeywords.validMessage;

const body = document.querySelector('body');
const enterprisesCarEedit = body.querySelector('#keywords-card-edit');
const form = enterprisesCarEedit.querySelector('#keywords-card-edit-form');

const name = form.querySelector('#keywords-card-edit-name');

const spinner = form.querySelector('#keywords-card-edit-spinner');

const buttonSubmit = form.querySelector('#keywords-card-edit-submit');
const buttonCancel = form.querySelector('#keywords-card-edit-cancel');

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
  input.classList.add('border');
  input.classList.add('border-danger');
  input.nextElementSibling.innerHTML = validMessage[input.id.match(/[\w]+$/)];
};

const hideAlert = (input) => {
  input.classList.remove('border');
  input.classList.remove('border-danger');
  input.nextElementSibling.innerHTML = '';
};

const formReset = () => {
  form.reset();

  hideAlert(name);

  hideSpinner();

  buttonSubmit.disabled = true;
  buttonCancel.disabled = false;
};

const callbackXhrSuccess = (response) => {

  console.dir(response);
  dataStorage.currentKeywordName = name.value;
  hideSpinner();
  formReset();
  $('#keywords-card-edit').modal('hide');

  switch (response.status) {
  case 200:
    keywordsButton.redraw();
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
  $('#keywords-card-edit').modal('hide');

  markup.informationtModal = {
    'title': 'Error',
    'messages': window.appSettings.messagess.xhrError
  };
};

const formIsChange = () => {
  if (name.value !== window.appFormCurrValue.name) {
    return true;
  }
  return false;
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
  urlApp = urlApp.replace('{{tagId}}', dataStorage.currentKeywordId);

  let response = {
    url: urlApp,
    metod: 'PUT',
    data: postData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };

  console.dir(response);

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

  $('#keywords-card-edit').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#keywords-card-edit').on('shown.bs.modal', () => {
    window.appFormCurrValue = {
      'name': name.value,
    };
  });

  form.addEventListener('input', (evt) => {
    hideAlert(evt.target);

    if (formIsChange()) {
      buttonSubmit.disabled = false;
    } else {
      buttonSubmit.disabled = true;
    }

  });

  form.addEventListener('submit', formSubmitHandler);
};

export default {
  start: addHandlers
};
