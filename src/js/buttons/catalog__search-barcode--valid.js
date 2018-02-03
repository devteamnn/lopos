import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import goodsCard from './catalog-groups-goods.js';
import search from './catalog__search.js';

let appUrl;
let messages;

let form;
let field1;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');

  form.dataset.formname = 'searchBarcode';
  field1 = form.querySelector('*[data-valid="field1"]');

  appUrl = window.appSettings[form.dataset.formname].UrlApi;
  messages = window.appSettings[form.dataset.formname].messages;

};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();

// чОрное колдовство с автооткрытием карточки при одном найденном варианте
    if (response.data.length === 1) {
      dataStorage.currentGoodId = response.data[0].id;
      goodsCard.fill();
      response.data = 0;
    } else if (response.data.length > 1) {
      search.drawResult(response.data);
    }

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
      'message': response.message
    };
    break;
  }
};

const submitFormAdd = () => {
  const stor = dataStorage.data;

  let postData = `barcode=${field1.value}&token=${stor.token}`;
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

export default {
  start(remModal) {
    initVar(remModal);
    formTools.work(modal, submitFormAdd);
  },
  stop() {
    formTools.reset();
  }
};
