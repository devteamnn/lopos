import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';

let appUrl;
let form;
let amount;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  amount = form.querySelector('*[data-valid="amount"]');
  appUrl = window.appSettings[form.dataset.formname].UrlApi;
};

const callbackXhrSuccess = (response) => {
  $(modal).modal('hide');
};

const callbackXhrError = (xhr) => {
  $(modal).modal('hide');
  formTools.reset();
};

const submitForm = () => {
  const stor = dataStorage.data;
  let value = amount.value;

  let postData = `token=${stor.token}&value=${value}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{goodId}}', dataStorage.currentGoodId);
  urlApp = urlApp.replace('{{stockId}}', dataStorage.currentStockId);

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
