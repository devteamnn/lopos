import dataStorage from './../tools/storage.js';
import formTools from './../tools/form-tools.js';
import goodsCard from './catalog__goods.js';
import search from './catalog__search.js';

let appUrl;
let form;
let field1;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');

  form.dataset.formname = 'searchBarcode';
  field1 = form.querySelector('*[data-valid="field1"]');

  appUrl = window.appSettings[form.dataset.formname].UrlApi;
};

const callbackXhrSuccess = (response) => {

  $(modal).modal('hide');
  formTools.reset();

// чОрное колдовство с автооткрытием карточки при одном найденном варианте
  if (response.data.length === 1) {
    $(modal).on('hidden.bs.modal', function (e) {
      dataStorage.currentGoodId = response.data[0].id;
      goodsCard.fill();
      response.data = 0;
    });
  } else if (response.data.length > 1) {
    search.drawResult(response.data);
  }
};

const callbackXhrError = () => {
  $(modal).modal('hide');
  formTools.reset();
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
    callbackSuccess: callbackXhrSuccess,
    callbackError: callbackXhrError
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
