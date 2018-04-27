import formTools from './../tools/form-tools.js';

let form;
let amount;
let modal;
let callback;

const initVar = (remModal, remCallback) => {
  modal = remModal;
  callback = remCallback;
  form = modal.querySelector('*[data-formName]');
  amount = form.querySelector('*[data-valid="amount"]');
};

const submitForm = () => {
  let val = amount.value;
  $(modal).modal('hide');
  formTools.reset();
  callback(val);
};

export default {
  start(remModal, remCallback) {
    initVar(remModal, remCallback);
    formTools.work(modal, submitForm);
    $(remModal).modal('show');

    setTimeout(() => {
      amount.focus();
    }, 500);

  },
  stop() {
    formTools.reset();
  }
};
