import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import debitCredit from './reference__debit-credit.js';

// let appUrlAdd;
// let appUrlEdit;
let messages;

let form;
let field1;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');

  form.dataset.formname = 'nomenclatureAddEdit';
  field1 = form.querySelector('*[data-valid="field1"]');

  // appUrlAdd = window.appSettings[form.dataset.formname].UrlApiAdd;
  // appUrlEdit = window.appSettings[form.dataset.formname].UrlApiEdit;
  messages = window.appSettings[form.dataset.formname].messages;

};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();
    debitCredit.redraw();
    /*
    if (dataStorage.currentCardName === '') {
      catalogCard.redrawList();
    } else {
      catalogCard.redrawCard();
    }
    */
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

  /*
  let urlApp = appUrlAdd.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  */
  let postData = `name=${field1.value}&token=${stor.token}`;
  let urlApp = `lopos_directory/${stor.directory}/operator/1/business/${stor.currentBusiness}/reason/${dataStorage.debitCreditType}`;
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

  /*
  let urlApp = appUrlEdit.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{NCid}}', dataStorage.currentCardId);
  */
  let postData = `name=${field1.value}&token=${stor.token}`;
  let urlApp = `lopos_directory/${stor.directory}/operator/1/business/${stor.currentBusiness}/reason/${dataStorage.debitCreditId}`;
  formTools.submit({
    url: urlApp,
    metod: 'PUT',
    data: postData,
    callbackSuccess: callbackXhrSuccess
  });
};

export default {
  start(remModal, type) {
    initVar(remModal);

    if (type === 'add') {
      formTools.work(modal, submitFormAdd);
    } else if (type === 'edit') {
      formTools.work(modal, submitFormEdit);
    }

  },
  stop() {
    formTools.reset();
  }
};
