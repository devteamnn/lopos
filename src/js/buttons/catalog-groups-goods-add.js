import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroupsGoods from './catalog-groups-goods.js';
import formTools from './../tools/form-tools.js';

const appUrl = window.appSettings.formAddGoods.UrlApi;
const messages = window.appSettings.formAddGoods.message;

const form = document.querySelector('#group-goods-add-form');

const name = form.querySelector('#group-goods-name');
const describe = form.querySelector('#group-goods-describe');
const priceGroup = form.querySelector('#group-goods-price');
const purchase = form.querySelector('#group-goods-price-purchase');
const extra = form.querySelector('#group-goods-price-extra');
const sell = form.querySelector('#group-goods-price-sell');
const barcode = form.querySelector('#group-goods-barcode');

const callbackXhrSuccess = (response) => {

  formTools.reset();
  $('#group-goods-add').modal('hide');

  switch (response.status) {
  case 200:
    catalogGroupsGoods.redraw();
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

  let postData = `token=${stor.token}&name=${name.value}&description=${describe.value}&purchase_price=${purchase.value}&selling_price=${sell.value}&group=${groupId}&barcode=${barcode.value}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);

  return {
    url: urlApp,
    metod: 'POST',
    data: postData,
  };
};

const calcExtra = () => {
  sell.value = (Number(purchase.value) + (purchase.value / 100 * extra.value)).toFixed(2);
};

const calcPercent = () => {
  extra.value = ((sell.value - purchase.value) * 100 / purchase.value).toFixed(2);
};

const priceChangeHandler = (evt) => {
  if (!evt.target.type === 'text') {
    return false;
  }

  if (formTools.validElement(evt.target)) {

    switch (evt.target.id) {
    case 'group-goods-price-purchase':
      calcExtra(); break;

    case 'group-goods-price-extra':
      calcExtra(); break;

    case 'group-goods-price-sell':
      calcPercent(); break;
    }
  }

  return true;
};

const addHandlers = () => {
  $('#group-goods-add').on('hidden.bs.modal', () => {
    formTools.reset();
  });

  $('#group-goods-add').on('shown.bs.modal', () => {
    formTools.work(form, submitForm, callbackXhrSuccess);
  });

  priceGroup.addEventListener('change', priceChangeHandler);

  // extra.addEventListener('change', (evt) => {
  //   if (formTools.validElement(evt.target)) {
  //     calcExtra();
  //   }
  // });

  // purchase.addEventListener('change', (evt) => {
  //   if (formTools.validElement(evt.target)) {
  //     calcExtra();
  //   }
  // });

  // sell.addEventListener('change', (evt) => {
  //   if (formTools.validElement(evt.target)) {
  //     calcPercent();
  //   }
  // });


};

export default {
  start: addHandlers
};
