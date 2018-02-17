import formTools from './../tools/form-tools.js';
import stor from './../tools/storage.js';

let form;
let count;
let modal;
let callback;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  count = form.querySelector('*[data-valid="count"]');

};

const submitForm = () => {
  let amount = Number(count.value);
  $(modal).modal('hide');
  formTools.reset();
  callback(amount);
};

export default {
  show(remModal, call) {
    initVar(remModal);

    callback = call;

    let nodeGoodCount = modal.querySelector('#operations-trade-add-count');
    let nodeGoodName = modal.querySelector('#operations-trade-add-name');
    let nodeGoodPrice = modal.querySelector('#operations-trade-add-price');

    nodeGoodName.innerHTML = stor.operationTradeCurrentGoodName;
    nodeGoodCount.innerHTML = stor.operationTradeCurrentGoodCount;
    nodeGoodPrice.innerHTML = stor.operationTradeCurrentGoodPrice;

    formTools.work(modal, submitForm);
    $(modal).modal('show');
  },
  stop() {
    formTools.reset();
  }
};
