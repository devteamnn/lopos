import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
// import catalogGroupsGoods from './catalog-groups-goods.js';
import formTools from './../tools/form-tools.js';
import tools from './../tools/tools.js';
import catalogGroups from './catalog-groups.js';

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

let inputInitValues;


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
  barcode = form.querySelector('#goods-card-barcode');

  appUrl1 = window.appSettings[form.dataset.formname].UrlApi1;
  appUrl2 = window.appSettings[form.dataset.formname].UrlApi2;
  appUrl3 = window.appSettings[form.dataset.formname].UrlApi3;
  messages = window.appSettings[form.dataset.formname].messages;
};

const callbackXhrError = (xhr) => {

  $('#goods-card').modal('hide');
  formTools.reset();
  catalogGroups.redrawGoods();

  console.dir(xhr);

  markup.informationtModal = {
    'title': 'Error',
    'message': xhr.response
  };
};

const submitForm2 = () => {
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
    callbackSuccess: callbackXhrSuccess2,
    callbackError: callbackXhrError
  });
};

const submitImg = () => {
  const stor = dataStorage.data;
  let postData = new FormData();
  postData.append('token', stor.token);
  postData.append('good', dataStorage.currentGoodId);
  postData.append('file', img.files[0]);

  let urlApp = appUrl3.replace('{{dir}}', stor.directory);

  formTools.submit({
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrImgLoadSuccess,
    callbackError: callbackXhrError
  });

};

const callbackXhrSuccess = (response) => {
  console.log('callbackXhr1');
  console.dir(response);

  switch (response.status) {
  case 200:

    if (name.value !== inputInitValues[0] || describe.value !== inputInitValues[1] || barcode.value !== inputInitValues[2] || groupId.value !== inputInitValues[3]) {
      submitForm2();
    } else if (img.files.length !== 0) {
      submitImg();
    } else {
      $('#goods-card').modal('hide');
      formTools.reset();
      catalogGroups.redrawGoods();
    }
    break;
  case 400:
    formTools.reset();
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

  switch (response.status) {
  case 200:
    if (img.files.length !== 0) {
      submitImg();
    } else {
      formTools.reset();
      $('#goods-card').modal('hide');
      catalogGroups.redrawGoods();
    }
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
  console.log('callbackImg');
  console.dir(response);

  switch (response.status) {
  case 200:
    console.log('img load - ok');

    formTools.reset();
    $('#goods-card').modal('hide');
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

  let postData = `token=${stor.token}&purchase_price=${purchase.value}&selling_price=${sell.value}`;
  let urlApp = appUrl2.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{goodId}}', dataStorage.currentGoodId);

  formTools.submit({
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
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

export default {

  start(remModal) {
    console.log('Card-Edit-START!');
    initVar(remModal);
    percent.innerHTML = calcPr();

    inputInitValues = [];
    inputInitValues[0] = name.value;
    inputInitValues[1] = describe.value;
    inputInitValues[2] = barcode.value;
    inputInitValues[3] = groupId.value;

    formTools.work(modal, submitForm);

    priceBlock.addEventListener('change', calcPrice);
  },

  stop() {
    formTools.reset();
  },

  removeHandlers: formTools.removeHandlers
};
