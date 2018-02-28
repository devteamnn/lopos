import xhr from './../tools/xhr.js';
import dataStorage from './../tools/storage.js';
import form from './form_login.js';
import mainWindow from './main_login_window.js';
import markTools from './../markup/tools.js';

const validId = window.appSettings.loginValid.id;
const validEmail = window.appSettings.loginValid.email;
const validPassword = window.appSettings.loginValid.password;

let callbackXhrSuccess = function (response) {
  form.addCaptchaCount();
  mainWindow.hideProgress('loginButtonSubmit', 'loginProgress');

  if (response.status === 200) {
    if (response.data.status === '0') {

      markTools.informationtModal = {
        'title': 'ОШИБКА: ',
        'message': window.appSettings.messages.responseStatus.res0
      };

    } else {
      dataStorage.data = response.data;
      dataStorage.permissions = response.data.list_of_permissions;
      document.dispatchEvent(new Event('loginSuccess'));
    }
  } else {
    markTools.informationtModal = {
      'title': 'ОШИБКА: ',
      'message': response.message
    };
  }
};

let callbackXhrError = function (response) {
  mainWindow.hideProgress('loginButtonSubmit', 'loginProgress');
};

let getRequestDataEmail = function (userLogin, userPassword) {
  // let dataApi = `email=${userLogin}&deviceToken=-&password=${userPassword}`;
  let requestData = new FormData();
  requestData.append('email', userLogin);
  requestData.append('deviceToken', '-');
  requestData.append('password', userPassword);

  return {
    url: window.appSettings.loginUrlApi.email,
    metod: 'POST',
    data: requestData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };
};

let getRequestDataId = function (userLogin, userPassword) {

  let folder = userLogin.substr(0, 8);
  let operator = userLogin.substr(8);

  let urlApi = window.appSettings.loginUrlApi.id.replace('{{dir}}', folder);
  urlApi = urlApi.replace('{{oper}}', operator);
  // let requestData = new FormData();
  // requestData.append('password', userPassword);
  let requestData = `password=${userPassword}`;

  return {
    url: urlApi,
    metod: 'POST',
    data: requestData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  };
};

let validateData = function (template, data) {

  if (template.test(data)) {
    return true;
  }

  return false;
};

let validateForm = function (userLogin, userPassword) {

  let valid = true;

  if (!validateData(validEmail, userLogin)) {
    if (!validateData(validId, userLogin)) {
      valid = false;
      mainWindow.setError('loginLogin',
        window.appSettings.messages.formValidation.login.login);
    }
  }

  if (!validateData(validPassword, userPassword)) {
    valid = false;
    mainWindow.setError('loginPassword',
      window.appSettings.messages.formValidation.login.password);
  }

  return valid;
};

let submitForm = function (userLogin, userPassword, isEmail) {
  if (validateData(validEmail, userLogin)) {
    xhr.request = getRequestDataEmail(userLogin, userPassword);
  } else {
    xhr.request = getRequestDataId(userLogin, userPassword);
  }

};

export default {

  submit(login, password) {
    submitForm(login, password);
  },

  validate(login, password) {
    return validateForm(login, password);
  }

};
