import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroupsGoods from './catalog-groups-goods.js';
import formTools from './../tools/form-tools.js';

const appUrl = window.appSettings.formExpressOperation.UrlApi;
const messages = window.appSettings.formExpressOperation.message;

const form = document.querySelector('#express-modal-form');

const price = form.querySelector('#express-modal-price');
const amount = form.querySelector('#express-modal-quantity');

const callbackXhrSuccess = (response) => {

  formTools.reset();
  $('#express-modal').modal('hide');

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

const submitForm = () => {
  const stor = dataStorage.data;
  let value = amount.value * Number(dataStorage.expressOperationType);

  let postData = `token=${stor.token}&value=${value}&price=${price.value}`;
  let urlApp = appUrl.replace('{{dir}}', stor.directory);
  urlApp = urlApp.replace('{{oper}}', stor.operatorId);
  urlApp = urlApp.replace('{{busId}}', stor.currentBusiness);
  urlApp = urlApp.replace('{{goodId}}', dataStorage.currentGoodId);
  urlApp = urlApp.replace('{{stockId}}', dataStorage.currentStockId);

  formTools.submit({
    url: urlApp,
    metod: 'POST',
    data: postData,
    callbackSuccess: callbackXhrSuccess
  });
};

const addHandlers = () => {
  $('#express-modal').on('hidden.bs.modal', () => {
    formTools.reset();
  });

  $('#express-modal').on('shown.bs.modal', () => {
    formTools.work(form, submitForm);
  });

};

export default {
  start: addHandlers
};
