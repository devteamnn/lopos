import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';
import debitCredit from './reference__debit-credit.js';

let form;
let field1;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  form.dataset.formname = 'nomenclatureAddEdit';
  field1 = form.querySelector('*[data-valid="field1"]');
};

const callbackXhrSuccess = (response) => {
  $(modal).modal('hide');
  formTools.reset();
  debitCredit.redraw();
};

const callbackXhrError = (xhr) => {
  $(modal).modal('hide');
  formTools.reset();
};

const submitFormAdd = () => {
  const stor = dataStorage.data;

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
