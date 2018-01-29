// Экспресс-операция БЕЗ ВАЛИДАЦИИ

import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import goodsButton from './catalog-groups-goods.js';

const expressModal = document.querySelector('#express-modal');
const expressModalPrice = document.querySelector('#express-modal-price');
const expressModalQuantity = document.querySelector('#express-modal-quantity');
const expressModalSubmit = document.querySelector('#express-modal-submit');
const expressModalForm = document.querySelector('#express-modal-form');

const onSuccessExpressExecute = (answer) => {
  $(expressModal).modal('hide');
  goodsButton.fill();
};

const onExpressModalSubmit = (evt) => {
  evt.preventDefault();
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/stock/${auth.currentStockId}/express`,
    data: `value=${expressModalQuantity.value * +auth.expressOperationType}&price=${expressModalPrice.value}&token=${auth.data.token}`,
    callbackSuccess: onSuccessExpressExecute,
  };
};

const start = () => {
  expressModalSubmit.removeAttribute('disabled');
  expressModalForm.addEventListener('submit', onExpressModalSubmit);
};

const stop = () => {
  expressModalSubmit.addAttribute('disabled', 'disabled');
  expressModalForm.addEventListener('submit', onExpressModalSubmit);
};

export default {
  start,
  stop
};
