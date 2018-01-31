import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroupsGoods from './catalog-groups-goods.js';
import formTools from './../tools/form-tools.js';
import tools from './../tools/tools.js';

const appUrl1 = window.appSettings.formEditGoods.UrlApi1;
const appUrl2 = window.appSettings.formEditGoods.UrlApi2;
const appUrl3 = window.appSettings.formEditGoods.UrlApi3;
const messages = window.appSettings.formEditGoods.message;

const form = document.querySelector('#goods-card-form');

const name = form.querySelector('#goods-card-name');
const describe = form.querySelector('#goods-card-describe');
const groupId = form.querySelector('#goods-card-group');

const img = form.querySelector('#goods-card-image-upload');

const priceBlock = form.querySelector('#goods-card-price-block');
const purchase = form.querySelector('#goods-card-price-purchase');
const sell = form.querySelector('#goods-card-price-sell');
const percent = form.querySelector('#goods-card-price-extra');

const barcode = form.querySelector('#goods-card-barcode');

const callbackXhrSuccess = (response) => {
  console.log('callbackXhr1');
  console.dir(response);

  formTools.reset();
  $('#goods-card').modal('hide');

  switch (response.status) {
  case 200:
    catalogGroupsGoods.fill();
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

const callbackXhrSuccess2 = (response) => {
  console.log('callbackXhr2');
  console.dir(response);

  formTools.reset();
  $('#goods-card').modal('hide');

  switch (response.status) {
  case 200:
    catalogGroupsGoods.fill();
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

const callbackXhrImgLoadSuccess = (response) => {
  console.log('callbackXhr2');
  console.dir(response);

  switch (response.status) {
  case 200:console.log('img load - ok'); break;
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

  let postData = `token=${stor.token}&name=${name.value}&description=${describe.value}&group=${groupId.value}&barcode=${barcode.value}`;
  let urlApp = appUrl1.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{goodId}}', dataStorage.currentGoodId);

  formTools.submit({
    url: urlApp,
    metod: 'PUT',
    data: postData,
    callbackSuccess: callbackXhrSuccess
  });

  postData = `token=${stor.token}&purchase_price=${purchase.value}&selling_price=${sell.value}`;
  urlApp = appUrl2.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{goodId}}', dataStorage.currentGoodId);

  formTools.submit({
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrSuccess2
  });
};

const calcPr = () => {
  return tools.calcPercent(purchase.value, sell.value) + '%';
};

const calcPrice = (evt) => {
  if (!evt.target.type === 'text') {
    return false;
  }
  if (formTools.validElement(evt.target)) {
    percent.innerHTML = calcPr();
  }
  return true;
};

const imgChangeHandler = (evt) => {
  const stor = dataStorage.data;

  // let postData = `token=${stor.token}&good=16&file=${img.files[0]}`;
  let postData = new FormData();
  postData.append('token', stor.token);
  postData.append('good', dataStorage.currentGoodId);
  postData.append('file', img.files[0]);
  let urlApp = appUrl3.replace('{{dir}}', stor.directory);

  let data = {
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrImgLoadSuccess
  };

  console.dir(data);
  formTools.submit(data);
};

// const addHandlers = () => {
//   $('#goods-card').on('hidden.bs.modal', () => {
//     formTools.reset();
//   });

//   $('#goods-card').on('shown.bs.modal', () => {
//     formTools.work(form, submitForm);
//     percent.innerHTML = calcPr();
//   });

//   priceBlock.addEventListener('change', calcPrice);
//   img.addEventListener('change', imgChangeHandler);
// };

export default {
  // start: addHandlers
  start() {
    percent.innerHTML = calcPr();
    formTools.work(form, submitForm);

    priceBlock.addEventListener('change', calcPrice);
    img.addEventListener('change', imgChangeHandler);
  },

  stop() {
    formTools.reset();
  },

  removeHandlers: formTools.removeHandlers
};
