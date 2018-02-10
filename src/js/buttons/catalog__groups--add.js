import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';
import catalogGroups from './catalog__groups.js';

let appUrl;
let form;
let name;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  name = form.querySelector('*[data-valid="name"]');
  appUrl = window.appSettings[form.dataset.formname].UrlApi;
};

const callbackXhrSuccess = () => {
  $(modal).modal('hide');
  formTools.reset();
  catalogGroups.redraw();
};

const callbackXhrError = () => {
  $(modal).modal('hide');
  formTools.reset();
};

const submitForm = () => {
  const stor = dataStorage.data;

  let postData = `name=${name.value}&token=${stor.token}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);

  formTools.submit({
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
  });
};

export default {
  start(remModal) {
    initVar(remModal);
    formTools.work(modal, submitForm);
  },
  stop() {
    formTools.reset();
  }
};
