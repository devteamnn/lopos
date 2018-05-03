import mainWindow from './main_login_window.js';
import xhr from './../tools/xhr.js';
import markup from './../markup/tools.js';

const regVal = window.appSettings.registerValid;
const regUrlApi = window.appSettings.registerUrlApi;

let callbackXhrSuccess = function (response) {

  mainWindow.hideProgress('registerButtonSubmit', 'registerProgress');
  markup.informationtModal = {
    'title': 'MESSAGE: ',
    'message': response.message,
    'isMess': true
  };
  mainWindow.confirmEmail();
};

let callbackXhrError = function (response) {
  mainWindow.hideProgress('registerButtonSubmit', 'registerProgress');
};

let validateName = function (name) {

  if (regVal.name.test(name)) {
    return true;
  }
  return false;

};

let validateEmail = function (email) {

  if (regVal.email.test(email)) {
    return true;
  }
  return false;

};

let validatePassword = function (password) {

  if (regVal.password.test(password)) {
    return true;
  }
  return false;

};

let validateConfirm = function (password, confirm) {

  if (password !== confirm || confirm === '') {
    return false;
  }
  return true;

};

let validateForm = function (name, email, password, confirm, userAgreement) {
  let valid = true;

  if (!validateName(name)) {
    mainWindow.setError('registerLogin',
      window.appSettings.messages.formValidation.registration.name);
    valid = false;
  }

  if (!validateEmail(email)) {
    mainWindow.setError('registerEmail',
      window.appSettings.messages.formValidation.registration.email);
    valid = false;
  }

  if (!validatePassword(password)) {
    mainWindow.setError('registerPassword',
      window.appSettings.messages.formValidation.registration.password);
    valid = false;
  }

  if (!validateConfirm(password, confirm)) {
    mainWindow.setError('registerConfirm',
      window.appSettings.messages.formValidation.registration.confirmPassword);
    valid = false;
  }

  if (!userAgreement) {
    mainWindow.setError('registerUserAgreement',
      window.appSettings.messages.formValidation.registration.UserAgreement);
    valid = false;
  }

  return valid;
};

let getRequestData = function (name, email, password) {
  // let requestData = `email=${email}&phone=&password=${password}&nickname=${name}&prefer_language=ru`;
  let requestData = new FormData();
  requestData.append('email', email);
  requestData.append('phone', '');
  requestData.append('password', password);
  requestData.append('nickname', name);
  requestData.append('prefer_language', 'ru');

  return {
    url: regUrlApi,
    metod: 'POST',
    data: requestData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };
};

let submitForm = function (name, email, password) {
  xhr.request = getRequestData(name, email, password);
};


export default {

  submit(name, email, password) {
    submitForm(name, email, password);
  },

  validate(name, email, password, confirm, userAgreement) {
    return validateForm(name, email, password, confirm, userAgreement);
  }

};
