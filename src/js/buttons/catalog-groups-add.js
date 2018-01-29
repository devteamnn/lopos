import dataStorage from './../tools/storage.js';
import markup from './../markup/tools.js';
import catalogGroups from './catalog-groups.js';
import formTools from './../tools/form-tools.js';


const appUrl = window.appSettings.formAddGroup.UrlApi;
const messages = window.appSettings.formAddGroup.message;

const form = document.querySelector('#groups-add-form');

const name = form.querySelector('#groups-add-name');

const callbackXhrSuccess = (response) => {

  formTools.reset();
  $('#groups-add').modal('hide');

  switch (response.status) {
  case 200:
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

const addHandlers = () => {
  $('#groups-add').on('hidden.bs.modal', () => {
    formTools.reset();
  });
  $('#groups-add').on('shown.bs.modal', () => {
    formTools.work(form, submitForm);
  });
};

export default {
  start: addHandlers
};
