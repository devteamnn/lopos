// Экспресс-операция БЕЗ ВАЛИДАЦИИ

import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';

const setStockModal = document.querySelector('#set-stock-modal');
const setStockModalQuantity = document.querySelector('#set-stock-modal-quantity');
const setStockModalSubmit = document.querySelector('#set-stock-modal-submit');
const setStockModalForm = document.querySelector('#set-stock-modal-form');

const onSuccessSetStockExecute = (answer) => {
  $(setStockModal).modal('hide');
};

const onStockModalSubmit = (evt) => {
  evt.preventDefault();
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/stock/${auth.currentStockId}/current_count`,
    data: `value=${setStockModalQuantity.value}&token=${auth.data.token}`,
    callbackSuccess: onSuccessSetStockExecute,
  };
};

const start = () => {
  setStockModalSubmit.removeAttribute('disabled');
  setStockModalForm.addEventListener('submit', onStockModalSubmit);
};

const stop = () => {
  setStockModalSubmit.addAttribute('disabled', 'disabled');
  setStockModalForm.addEventListener('submit', onStockModalSubmit);
};

export default {
  start,
  stop
};
