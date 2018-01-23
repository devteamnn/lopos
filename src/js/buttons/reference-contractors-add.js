import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import referenceContractors from './reference-contractors.js';
import markup from './../markup/tools.js';

const appUrl = window.appSettings.formAddContractor.UrlApi;
const validPattern = window.appSettings.formAddContractor.validPatterns;
const validMessage = window.appSettings.formAddContractor.validMessage;
const messages = window.appSettings.formAddContractor.messages;


const body = document.querySelector('body');
const contractorsAdd = body.querySelector('#contractors-add');
const form = contractorsAdd.querySelector('#contractors-add-form');

const name = form.querySelector('#contractors-name');
const describe = form.querySelector('#contractors-describe');
const contact = form.querySelector('#contractors-contact');
const phone = form.querySelector('#contractors-phone');
const email = form.querySelector('#contractors-email');

const spinner = form.querySelector('#contractors-add-spinner');

const buttonSubmit = form.querySelector('#contractors-add-submit');
const buttonCancel = form.querySelector('#contractors-add-cancel');

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
  hideAlert(describe);
  hideAlert(contact);
  hideAlert(phone);
  hideAlert(email);

  hideSpinner();

  buttonSubmit.disabled = true;
  buttonCancel.disabled = false;
};

const callbackXhrSuccess = (response) => {
  console.dir(response);

  hideSpinner();
  formReset();
  $('#contractors-add').modal('hide');

  switch (response.status) {
  case 200:
    referenceContractors.redraw();
    break;
  case 400:
    markup.informationtModal = {
      'title': 'Error',
      'message': messages.mes400
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
  if (!validPattern.describe.test(describe.value)) {
    valid = false;
    showAlert(describe);
  }
  if (!validPattern.contact.test(contact.value)) {
    valid = false;
    showAlert(contact);
  }
  if (!validPattern.phone.test(phone.value)) {
    valid = false;
    showAlert(phone);
  }
  if (!validPattern.email.test(email.value)) {
    valid = false;
    showAlert(email);
  }

  return valid;
};

const formIsChange = () => {
  if (name.value !== window.appFormCurrValue.name) {
    return true;
  }
  if (describe.value !== window.appFormCurrValue.describe) {
    return true;
  }
  if (contact.value !== window.appFormCurrValue.contact) {
    return true;
  }
  if (phone.value !== window.appFormCurrValue.phone) {
    return true;
  }
  if (email.value !== window.appFormCurrValue.email) {
    return true;
  }
  return false;
};

const getUrl = () => {
  let url = '';

  switch (dataStorage.currentContractorOperation) {
  case 'add':
    url = appUrl.add.replace('{{dir}}', stor.directory);
    url = url.replace('{{oper}}', stor.operatorId);
    url = url.replace('{{busId}}', stor.currentBusiness);
    break;
  case 'edit':
    url = appUrl.edit.replace('{{dir}}', stor.directory);
    url = url.replace('{{oper}}', stor.operatorId);
    url = url.replace('{{busId}}', stor.currentBusiness);
    url = url.replace('{{agentId}}', dataStorage.currentContractorId);
    break;
  }
  return url;
};

const submitForm = () => {
  let appLink = getUrl();

  let postData = `token=${stor.token}&type=${dataStorage.currentContractorType}&name=${name.value}&email=${email.value}&description=${describe.value}&phone=${phone.value}&FIO=${contact.value}`;

  let response = {
    url: appLink,
    metod: (dataStorage.currentContractorOperation === 'add') ? 'POST' : 'PUT',
    data: postData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };

  console.log('response:');
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

  $('#contractors-add').on('hidden.bs.modal', () => {
    formReset();
  });

  $('#contractors-add').on('shown.bs.modal', () => {

    if (dataStorage.currentContractorOperation === 'edit') {
      window.appFormCurrValue = {
        'name': name.value,
        'describe': describe.value,
        'contact': contact.value,
        'phone': phone.value,
        'email': email.value
      };
    }

  });

  form.addEventListener('input', (evt) => {
    hideAlert(evt.target);

    if (dataStorage.currentContractorOperation === 'edit') {
      if (formIsChange()) {
        buttonSubmit.disabled = false;
      } else {
        buttonSubmit.disabled = true;
      }
    } else {
      buttonSubmit.disabled = false;
    }

  });

  form.addEventListener('submit', formSubmitHandler);
};

export default {
  start: addHandlers,
};
