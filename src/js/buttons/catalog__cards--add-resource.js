import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import catalogCard from './catalog__cards.js';

let appUrl;
let messages;

let form;
let quantity;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  quantity = form.querySelector('*[data-valid="quantity"]');

  appUrl = window.appSettings[form.dataset.formname].UrlApi;
  messages = window.appSettings[form.dataset.formname].message;
};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();
    catalogCard.redrawCard();
    break;
  case 400:
    markup.informationtModal = {
      'title': 'Error',
      'message': messages.mes400
    };
    break;
  case 271:
    markup.informationtModal = {
      'title': 'Error',
      'message': response.messages
    };
    break;
  }
};

const callbackXhrError = (xhr) => {

  $(modal).modal('hide');
  formTools.reset();

  markup.informationtModal = {
    'title': 'ОШИБКА СВЯЗИ',
    'message': `Ошибка ${xhr.status}: ${xhr.statusText}`
  };
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
