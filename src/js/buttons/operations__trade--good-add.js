import formTools from './../tools/form-tools.js';
import stor from './../tools/storage.js';


const modal = document.querySelector('#operations-trade-add');
const form = modal.querySelector('*[data-formName]');
const count = form.querySelector('*[data-valid="count"]');

const nodeGoodCount = modal.querySelector('#operations-trade-add-count');
const nodeGoodName = modal.querySelector('#operations-trade-add-name');
const nodeGoodPrice = modal.querySelector('#operations-trade-add-price');
const nodeFormLabel = modal.querySelector('#operations-trade-add-label');

let callback;

const formFilling = (type) => {
  nodeGoodName.innerHTML = stor.operationTradeCurrentGoodName;
  nodeGoodPrice.innerHTML = stor.operationTradeCurrentGoodPrice;

  switch (type) {
  case 'l':
    nodeFormLabel.innerHTML = 'Добавление в накладную';
    nodeGoodCount.innerHTML = stor.operationTradeCurrentGoodCount;
    count.placeholder = 'Количество';
    break;
  case 'r':
    nodeFormLabel.innerHTML = 'Количество товара<br>во временной накладной';
    nodeGoodCount.innerHTML = stor.operationTradeCurrentGoodOldCount;
    count.placeholder = stor.operationTradeCurrentGoodCount;
    break;
  }
};

const submitForm = () => {
  let amount = Number(count.value);
  $(modal).modal('hide');
  formTools.reset();
  callback(amount);
};

export default {
// type = l - леаая колонка, type = r - правая колонка
  show(call, type) {
    formFilling(type);

    callback = call;

    formTools.work(modal, submitForm);
    $(modal).modal('show');
  },
};
