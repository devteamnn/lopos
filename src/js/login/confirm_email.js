import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import mainWindow from './main_login_window.js';
import markTools from './../markup/tools.js';

const kodVal = window.appSettings.confirmEmailKodValid;
const urlApi = window.appSettings.confirmEmailUrlApi;

let callbackXhrSuccess = function (response) {
  mainWindow.hideProgress('emailConfirmButtonSubmit', 'confirmProgress');

  if (response.data.status === '0') {

    markTools.informationtModal = {
      'title': 'ОШИБКА: ',
      'message': window.appSettings.messages.responseStatus.res0
    };

  } else {
    dataStorage.data = response.data;
    document.dispatchEvent(new Event('loginSuccess'));
  }
};

let callbackXhrError = function (response) {
  mainWindow.hideProgress('emailConfirmButtonSubmit', 'confirmProgress');
};

let validateForm = function (kod) {

  if (kodVal.test(kod)) {
    return true;
  }
  mainWindow.setError('emailConfirmInputKey',
    window.appSettings.messages.formValidation.emailConfirm.key);
  return false;
};

let getRequestData = function (kod, email) {

  // let requestData = `email=${email}&validate_code=${kod}&preferable_language=ru`;
  let requestData = new FormData();
  requestData.append('email', email);
  requestData.append('validate_code', kod);
  requestData.append('preferable_language', 'ru');
  return {
    url: urlApi,
    metod: 'POST',
    data: requestData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };
};


let submitForm = function (kod, email) {
  xhr.request = getRequestData(kod, email);
};


export default {
  submit(kod, email) {
    submitForm(kod, email);
  },

  validate(kod) {
    return validateForm(kod);
  }
};
