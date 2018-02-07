import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import catalogCard from './catalog__cards.js';

let appUrlAdd;
let appUrlEdit;
let messages;

let form;
let field1;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');

  form.dataset.formname = 'nomenclatureAddEdit';
  field1 = form.querySelector('*[data-valid="field1"]');

  appUrlAdd = window.appSettings[form.dataset.formname].UrlApiAdd;
  appUrlEdit = window.appSettings[form.dataset.formname].UrlApiEdit;
  messages = window.appSettings[form.dataset.formname].messages;

};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();
    catalogCard.redraw();
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

const submitFormAdd = () => {
  const stor = dataStorage.data;

  let postData = `name=${field1.value}&token=${stor.token}`;
  let urlApp = appUrlAdd.replace('{{dir}}', stor.directory);
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

const submitFormEdit = () => {
  const stor = dataStorage.data;

  let postData = `name=${field1.value}&token=${stor.token}`;
  let urlApp = appUrlEdit.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{NCid}}', dataStorage.currentCardId);

  formTools.submit({
    url: urlApp,
    metod: 'PUT',
    data: postData,
    callbackSuccess: callbackXhrSuccess
  });
};

export default {
  start(remModal) {
    initVar(remModal);

    if (name.value === '') {
      formTools.work(modal, submitFormAdd);
    } else {
      formTools.work(modal, submitFormEdit);
    }
  },
  stop() {
    formTools.reset();
  }
};
