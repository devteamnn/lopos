import formTools from './../tools/form-tools.js';

const modal = document.querySelector('#operations-trade-discount');
const form = modal.querySelector('*[data-formName]');
const discount = form.querySelector('*[data-valid="discount"]');
const discountLabel = form.querySelector('*[data-validLabel="discount"]');

const nodeDiscountMax = modal.querySelector('#operations-trade-discount-max-label');
const nodeSubmit = modal.querySelector('#operations-trade-discount-submit');

let callback;
let max;

const submitForm = () => {
  let currentDiscount = Number(discount.value);

  if (currentDiscount <= max) {
    $(modal).modal('hide');
    formTools.reset();
    callback(currentDiscount);
  } else {
    formTools.stopLoad();
    discountLabel.innerHTML = 'Скидка больше максимальной';
    nodeSubmit.disabled = true;
  }
};

export default {
  show(call, discMax) {

    nodeDiscountMax.innerHTML = `(макс. ${discMax}%)`;

    callback = call;
    max = Number(discMax);

    formTools.work(modal, submitForm);
    $(modal).modal('show');
  },
};
