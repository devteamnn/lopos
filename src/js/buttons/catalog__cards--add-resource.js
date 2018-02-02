// Экспресс-операция БЕЗ ВАЛИДАЦИИ

import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import cardsButton from './catalog__cards.js';

const addResourcesModal = document.querySelector('#add-resources-modal');
const addResourcesModalForm = document.querySelector('#add-resources-modal-form');
const addResourcesModalSubmit = document.querySelector('#add-resources-modal-submit');
const addResourcesModalQuantity = document.querySelector('#add-resources-modal-quantity');

const onSuccessExpressExecute = (answer) => {
  console.log(answer);
  $(addResourcesModal).modal('hide');
  cardsButton.redraw();
};

const onExpressModalSubmit = (evt) => {
  evt.preventDefault();
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card/${auth.currentCardId}/compare`,
    data: `good=${auth.currentGoodId}&value=${addResourcesModalQuantity.value * +auth.currentCardOperation}&token=${auth.data.token}`,
    callbackSuccess: onSuccessExpressExecute,
  };
};

const start = () => {
  addResourcesModalSubmit.removeAttribute('disabled');
  addResourcesModalForm.addEventListener('submit', onExpressModalSubmit);
};

const stop = () => {
  addResourcesModalSubmit.addAttribute('disabled', 'disabled');
  addResourcesModalForm.addEventListener('submit', onExpressModalSubmit);
};

export default {
  start,
  stop
};
