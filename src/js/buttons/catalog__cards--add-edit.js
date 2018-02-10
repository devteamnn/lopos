import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';
import catalogCard from './catalog__cards.js';

let appUrlAdd;
let appUrlEdit;

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

};

const callbackXhrSuccess = () => {
  $(modal).modal('hide');
  formTools.reset();
  if (dataStorage.currentCardName === '') {
    catalogCard.redrawList();
  } else {
    catalogCard.redrawCard();
  }
};

const callbackXhrError = () => {
  $(modal).modal('hide');
  formTools.reset();
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

    if (dataStorage.currentCardName === '') {
      formTools.work(modal, submitFormAdd);
    } else {
      formTools.work(modal, submitFormEdit);
    }
  },
  stop() {
    formTools.reset();
  }
};
