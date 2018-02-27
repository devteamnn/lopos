import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import uValid from './universal-validity-micro.js';
// import toolsMarkup from '../markup/tools.js';

const balanceList = document.querySelector('#list-balance-list');
const balanceCardPlusBody = document.querySelector('#balance-card-plus-data');
const balanceCardMinusBody = document.querySelector('#balance-card-minus');
const balanceCardPlusTab = document.querySelector('#balance-card-plus-tab');
const balanceCardMinusTab = document.querySelector('#balance-card-minus-tab');

const balanceAmount = document.querySelector('#balance-amount');
const balanceAmountValid = document.querySelector('#balance-amount-valid');
const balanceSetDescribe = document.querySelector('#balance-set-describe');
const balanceSetDescribeValid = document.querySelector('#balance-set-valid');
const balanceStocks = document.querySelector('#balance-stocks');

const balanceForm = document.querySelector('#balance-set-form');
const balanceFormSend = document.querySelector('#list-balance-make');

// ############################## РАЗМЕТКА ##############################
const getElement = (item, index) => {

  return `
  <input type="radio" id="operations-${item.id}" name="contact" value="email" class="d-none">
  <label style="padding-left: 34px;" for="operations-${item.id}"  class="d-flex justify-content-between align-items-center reference-string" data-debit-credit-id="${item.id}" data-debit-credit-name="${item.name}">
    <div><span class="reference-row-number">${index + 1}</span> ${item.name}</div>
    <div class="d-flex justify-content-between align-items-center">
    </div>
  </label>`;
};

const drawDataInContainer = (balanceData, container) => {
  balanceData.forEach((item, index) => container.insertAdjacentHTML('beforeend', getElement(item, index)));
};

const onSuccessBalanceFormSend = () => {
  balanceAmount.value = '';
  balanceSetDescribe.value = '';
  balanceFormSend.setAttribute('disabled', 'disabled');
};

const onBalanceFormSendSubmit = (evt) => {
  evt.preventDefault();
  if (uValid.check([balanceAmount, balanceSetDescribe])) {
    xhr.request = {
      metod: 'POST',
      url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/stock/${auth.currentStockId}/balance_act`,
      data: `value=${auth.debitCreditType === 'credit' ? '-' : ''}${balanceAmount.value}&reason=${auth.debitCreditId}&comment=${balanceSetDescribe.value}&token=${auth.data.token}`,
      callbackSuccess: onSuccessBalanceFormSend,
    };
  }

};

balanceFormSend.addEventListener('click', onBalanceFormSendSubmit);
balanceForm.addEventListener('submit', onBalanceFormSendSubmit);

balanceStocks.addEventListener('change', (evt) => {
  auth.currentStockId = evt.target.value;
});

balanceForm.addEventListener('input', () => balanceFormSend.removeAttribute('disabled'));

let selectedString = '';
balanceCardPlusBody.addEventListener('change', function (evt) {
  if (selectedString) {
    selectedString.classList.remove('bg-light');
  }
  selectedString = evt.target.labels[0];
  selectedString.classList.add('bg-light');
  balanceAmount.removeAttribute('disabled', 'disabled');
  balanceSetDescribe.removeAttribute('disabled', 'disabled');
  if (balanceAmount.value || balanceSetDescribe.value) {
    balanceFormSend.removeAttribute('disabled');
  } else {
    balanceFormSend.setAttribute('disabled', 'disabled');
  }
  auth.debitCreditId = selectedString.dataset.debitCreditId;

});

balanceCardMinusBody.addEventListener('change', function (evt) {
  console.log(evt);
  if (selectedString) {
    selectedString.classList.remove('bg-light');
  }
  selectedString = evt.target.labels[0];
  selectedString.classList.add('bg-light');
  balanceAmount.removeAttribute('disabled', 'disabled');
  balanceSetDescribe.removeAttribute('disabled', 'disabled');
  if (balanceAmount.value || balanceSetDescribe.value) {
    balanceFormSend.removeAttribute('disabled');
  } else {
    balanceFormSend.setAttribute('disabled', 'disabled');
  }
  auth.debitCreditId = selectedString.dataset.debitCreditId;
});
// ############################## ЗАГРУЗКА И ОТРИСОВКА ДАННЫХ ##############################


const onSuccessBalanceMinusLoad = (balanceData) => {
  drawDataInContainer(balanceData.data.all_reasons, balanceCardMinusBody);
  auth.debitCreditType = 'credit';
  balanceAmount.setAttribute('disabled', 'disabled');
  balanceSetDescribe.setAttribute('disabled', 'disabled');
  balanceStocks.innerHTML = balanceData.data.all_stocks.map((item) => `<option value="${item.id}" ${(item.id === auth.data.currentStock) ? 'selected' : ''}>${item.name}</option>`).join('');
  balanceFormSend.setAttribute('disabled', 'disabled');

};


const onSuccessBalancePlusLoad = (balanceData) => {
  drawDataInContainer(balanceData.data.all_reasons, balanceCardPlusBody);
  auth.debitCreditType = 'debit';
  balanceAmount.setAttribute('disabled', 'disabled');
  balanceSetDescribe.setAttribute('disabled', 'disabled');
  balanceStocks.innerHTML = balanceData.data.all_stocks.map((item) => `<option value="${item.id}" ${(item.id === auth.data.currentStock) ? 'selected' : ''}>${item.name}</option>`).join('');
  balanceFormSend.setAttribute('disabled', 'disabled');
};


const getCredit = () => {
  balanceCardMinusBody.innerHTML = '';
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/operation/credit`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessBalanceMinusLoad,
  };

};
const getDebit = () => {

  balanceCardPlusBody.innerHTML = '';
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/operation/debit`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessBalancePlusLoad,
  };
};

const init = () => {
  balanceCardMinusBody.innerHTML = '';
  balanceCardPlusBody.innerHTML = '';
  balanceCardPlusTab.classList.remove('active');
  balanceCardMinusTab.classList.remove('active');
  balanceAmount.setAttribute('disabled', 'disabled');
  balanceSetDescribe.setAttribute('disabled', 'disabled');
  balanceAmount.value = '';
  balanceSetDescribe.value = '';
  balanceAmountValid.innerHTML = '';
  balanceSetDescribeValid.innerHTML = '';
  auth.currentStockId = auth.data.currentStock;
};

export default {

  start() {
    balanceList.addEventListener('click', init);
    balanceCardPlusTab.addEventListener('click', getDebit);
    balanceCardMinusTab.addEventListener('click', getCredit);
  },

  stop() {
    balanceList.removeEventListener('click', init);
    balanceCardPlusTab.removeEventListener('click', getDebit);
    balanceCardMinusTab.removeEventListener('click', getCredit);
  }
};
