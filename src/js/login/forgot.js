import xhr from './../tools/xhr.js';
import mainWindow from './main_login_window.js';

const emailVal = window.appSettings.forgotEmailValid;
const urlApi = window.appSettings.forgotUrlApi;

let callbackXhrSuccess = function (response) {
  mainWindow.hideProgress('forgotButtonSubmit', 'forgotProgress');

  if (response.status === 400) {
    mainWindow.setAlert(response.message, 'message');
  } else {
    mainWindow.setAlert(response.message, 'error');
  }
};

let callbackXhrError = function (response) {
  mainWindow.hideProgress('forgotButtonSubmit', 'forgotProgress');
  mainWindow.setAlert(window.appSettings.messages.xhrError, 'error');
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

  let requestData = `email=${email}`;
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
