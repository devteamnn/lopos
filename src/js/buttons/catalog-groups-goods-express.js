import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';

const appUrl = window.appSettings.formExpressOperation.UrlApi;
const messages = window.appSettings.formExpressOperation.message;

let form;
let price;
let amount;
let modal;

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
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

export default {
  start(remModal) {
    modal = remModal;
    form = modal.querySelector('*[data-formName]');
    price = form.querySelector('*[data-valid="price"]');
    amount = form.querySelector('*[data-valid="amount"]');

    formTools.work(form, submitForm);
  },
  stop() {
    formTools.reset();
  }
};
