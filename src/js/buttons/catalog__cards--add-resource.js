import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';
import catalogCard from './catalog__cards.js';

let appUrl;
let form;
let quantity;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  quantity = form.querySelector('*[data-valid="quantity"]');
  appUrl = window.appSettings[form.dataset.formname].UrlApi;
};

const callbackXhrSuccess = () => {
  $(modal).modal('hide');
  formTools.reset();
  catalogCard.redrawCard();
};

const callbackXhrError = () => {
  $(modal).modal('hide');
  formTools.reset();
};

const submitForm = () => {
  const stor = dataStorage.data;

  let postData = `good=${dataStorage.currentGoodId}&value=${quantity.value * +dataStorage.currentCardOperation}&token=${stor.token}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{NCid}}', dataStorage.currentCardId);

  formTools.submit({
    url: urlApp,
    metod: 'PUT',
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
