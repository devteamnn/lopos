import xhr from './../tools/xhr.js';
import mainWindow from './main_login_window.js';
import markTools from './../markup/tools.js';

const emailVal = window.appSettings.forgotEmailValid;
const urlApi = window.appSettings.forgotUrlApi;

let callbackXhrSuccess = function (response) {
  mainWindow.hideProgress('forgotButtonSubmit', 'forgotProgress');

  if (response.status === 400) {
    markTools.setAlert = 'ОШИБКА: ' + response.message;
  } else {
    // зеленое сообщение
    markTools.setAlert = response.message;
  }
};

let callbackXhrError = function (response) {
  mainWindow.hideProgress('forgotButtonSubmit', 'forgotProgress');
  markTools.setAlert = 'ОШИБКА: ' +
    window.appSettings.messages.xhrError;
};

let validateForm = function (email) {

  if (emailVal.test(email)) {
    return true;
  }
  mainWindow.setError('forgotInputEmail',
    window.appSettings.messages.formValidation.forgot.email);
  return false;
};

let getRequestData = function (email) {

  // let requestData = `email=${email}`;
  let requestData = new FormData();
  requestData.append('email', email);

  return {
    url: urlApi,
    metod: 'POST',
    data: requestData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };
};


let submitForm = function (email) {
  xhr.request = getRequestData(email);
};

export default {
  submit(email) {
    submitForm(email);
  },

  validate(email) {
    return validateForm(email);
  }
};
