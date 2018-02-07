import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import catalogGroups from './catalog-groups.js';
import tools from './../tools/tools.js';

let appUrl;
let messages;

let form;
let name;
let modal;
let describe;
let purchase;
let percent;
let price;
let barcode;
let priceBlock;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  name = form.querySelector('*[data-valid="name"]');
  describe = form.querySelector('*[data-valid="describe"]');
  purchase = form.querySelector('*[data-valid="purchase"]');
  percent = form.querySelector('*[data-valid="percent"]');
  price = form.querySelector('*[data-valid="price"]');
  barcode = form.querySelector('*[data-valid="barcode"]');

  priceBlock = form.querySelector('#group-goods-price');

  appUrl = window.appSettings[form.dataset.formname].UrlApi;
  messages = window.appSettings[form.dataset.formname].messages;

};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();
    catalogGroups.redrawGoods();
    break;
  case 400:
    $(modal).modal('hide');
    formTools.reset();
    markup.informationtModal = {
      'title': 'Error',
      'message': messages.mes400
    };
    break;
  case 271:
    $(modal).modal('hide');
    formTools.reset();
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
  const groupId = dataStorage.currentGroupId;

  let postData = `token=${stor.token}&name=${name.value}&description=${describe.value}&purchase_price=${purchase.value}&selling_price=${price.value}&group=${groupId}&barcode=${barcode.value}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
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

const calcPrice = (evt) => {
  if (!evt.target.type === 'text') {
    return false;
  }
  if (formTools.validElement(evt.target)) {

    switch (evt.target.dataset.valid) {
    case 'percent':
      price.value = tools.calcPrice(purchase.value, percent.value);
      break;
    case 'purchase':
      if (price.value === '') {
        price.value = purchase.value;
      }
      percent.value = tools.calcPercent(purchase.value, price.value);
      break;
    case 'price':
      if (purchase.value === '') {
        purchase.value = price.value;
      }
      percent.value = tools.calcPercent(purchase.value, price.value);
      break;
    }
  }
  return true;
};

export default {
  start(remModal) {
    initVar(remModal);
    priceBlock.addEventListener('change', calcPrice);
    document.querySelector('#group-goods-group').value = dataStorage.currentGroupName;
    formTools.work(modal, submitForm);
  },
  stop() {
    formTools.reset();
  }
};
