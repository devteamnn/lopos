import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroups from './catalog-groups.js';
import formTools from './../tools/form-tools.js';
import tools from './../tools/tools.js';

const appUrl = window.appSettings.formAddGoods.UrlApi;
const messages = window.appSettings.formAddGoods.message;

const form = document.querySelector('#group-goods-add-form');

const name = form.querySelector('#group-goods-name');
const describe = form.querySelector('#group-goods-describe');
const priceGroup = form.querySelector('#group-goods-price');
const purchase = form.querySelector('#group-goods-price-purchase');
const precent = form.querySelector('#group-goods-price-extra');
const price = form.querySelector('#group-goods-price-sell');
const barcode = form.querySelector('#group-goods-barcode');

const callbackXhrSuccess = (response) => {

  formTools.reset();
  $('#group-goods-add').modal('hide');

  switch (response.status) {
  case 200:
    catalogGroups.redrawGoods();
    break;
  case 400:
    markup.informationtModal = {
      'title': 'Error',
      'messages': messages.mes400
    };
    break;
  case 271:
    markup.informationtModal = {
      'title': 'Error',
      'messages': response.messages
    };
    break;
  }
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
    callbackSuccess: callbackXhrSuccess
  });
};

const priceChangeHandler = (evt) => {
  if (!evt.target.type === 'text') {
    return false;
  }

  if (formTools.validElement(evt.target)) {

    switch (evt.target.id) {
    case 'group-goods-price-purchase':
      price.value = tools.calcPrice(purchase.value, precent.value); break;

    case 'group-goods-price-extra':
      price.value = tools.calcPrice(purchase.value, precent.value); break;

    case 'group-goods-price-sell':
      precent.value = tools.calcPercent(purchase.value, price.value); break;
    }
  }

  return true;
};

const addHandlers = () => {
  $('#group-goods-add').on('hidden.bs.modal', () => {
    formTools.reset();
  });

  $('#group-goods-add').on('shown.bs.modal', () => {
    document.querySelector('#group-goods-group').value = dataStorage.currentGroupName;
    formTools.work(form, submitForm);
  });

  priceGroup.addEventListener('change', priceChangeHandler);
};

export default {
  start: addHandlers
};
