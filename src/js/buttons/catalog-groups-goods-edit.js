import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroupsGoods from './catalog-groups-goods.js';
import formTools from './../tools/form-tools.js';
import tools from './../tools/tools.js';

let modal;
let appUrl1;
let appUrl2;
let appUrl3;
let messages;
let form;
let name;
let describe;
let groupId;
let img;
let purchase;
let sell;
let percent;
let barcode;
let priceBlock;


const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('#goods-card-form');
  name = form.querySelector('#goods-card-name');
  describe = form.querySelector('#goods-card-describe');
  groupId = form.querySelector('#goods-card-group');
  img = form.querySelector('#goods-card-image-upload');
  priceBlock = form.querySelector('#goods-card-price-block');
  purchase = form.querySelector('#goods-card-price-purchase');
  sell = form.querySelector('#goods-card-price-sell');
  percent = form.querySelector('#goods-card-price-extra');
  barcode = form.querySelector('#goods-card-barcode');

  appUrl1 = window.appSettings[form.dataset.formname].UrlApi1;
  appUrl2 = window.appSettings[form.dataset.formname].UrlApi2;
  appUrl3 = window.appSettings[form.dataset.formname].UrlApi3;
  messages = window.appSettings[form.dataset.formname].message;
};

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
  $(modal).modal('hide');

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
  start(remModal) {
    console.log('Card-Edit-START!');
    initVar(remModal);
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
