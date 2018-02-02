import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import formTools from './../tools/form-tools.js';
import catalogGroups from './catalog-groups.js';

let appUrl;
let messages;

let form;
let name;
let modal;

const initVar = (remModal) => {
  modal = remModal;
  form = modal.querySelector('*[data-formName]');
  name = form.querySelector('*[data-valid="name"]');

  appUrl = window.appSettings[form.dataset.formname].UrlApi;
  messages = window.appSettings[form.dataset.formname].message;

};

const callbackXhrSuccess = (response) => {
  switch (response.status) {
  case 200:
    $(modal).modal('hide');
    formTools.reset();
    catalogGroups.redraw();
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

  let postData = `name=${name.value}&token=${stor.token}`;
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
    formTools.work(modal, submitForm);
  },
  stop() {
    formTools.reset();
  }
};
