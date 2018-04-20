import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
const START_YEAR = 2017;
import bills from './universal-bills-list.js';
// import goods from './universal-goods-list.js';
// import uValid from './universal-validity-micro.js';
import toolsMarkup from '../markup/tools.js';

const docsList = document.querySelector('#list-docs-list');
// const docsHeader = document.querySelector('#list-docs-header');
const docsBody = document.querySelector('#list-docs-body');
const docsStocks = document.querySelector('#docs-stocks');

const docsYear = document.querySelector('#docs-year');
const docsMonth = document.querySelector('#docs-month');
const docsDay = document.querySelector('#docs-day');

const docsBillBtn = document.querySelector('#docs-bill-btn');
const getDocsBtn = document.querySelector('#get-docs-btn');
const docsBalanceBtn = document.querySelector('#docs-balance-btn');
const docsReturnBtn = document.querySelector('#docs-return-btn');
const billCard = document.querySelector('#bill-card');

const billCardTotal = document.querySelector('#bill-card-total');
const billCardType = document.querySelector('#bill-card-type');
const billCardStock = document.querySelector('#bill-card-stock');
const billCardId = document.querySelector('#bill-card-id');
const billCardTime = document.querySelector('#bill-card-time');
const billCardUser = document.querySelector('#bill-card-user');
const billCardGoods = document.querySelector('#bill-card-goods');
const billDeliveryBtn = document.querySelector('#bill-delivery-btn');
const billDeleteBtn = document.querySelector('#bill-delete-btn');
const billMakePdfBtn = document.querySelector('#bill-pdf-btn');

const balanceCard = document.querySelector('#balance-act-card');

const balanceCardStock = document.querySelector('#balance-act-card-stock');
const balanceCardId = document.querySelector('#balance-act-card-id');
const balanceCardUser = document.querySelector('#balance-act-card-user');
const balanceCardKontragentUser = document.querySelector('#bill-card-kontragent-name');


const balanceCardTime = document.querySelector('#balance-act-card-time');
const balanceCardTotal = document.querySelector('#balance-act-total');
const balanceCardReason = document.querySelector('#balance-act-reason');
const balanceCardComment = document.querySelector('#balance-act-comment');
const balanceDeleteBtn = document.querySelector('#balance-act-delete-btn');

const downloadPdfLink = document.querySelector('#bill-download-link');
const downloadPdfBtn = document.querySelector('#bill-download-btn');

// ############################## РАЗМЕТКА ТОВАРОВ #############
const getGoodString = (item, index) => {
  return `
    <div class="reference-header">
        <div class="reference-column-7">${index + 1}</div>
        <div class="reference-column-7">${item.good}</div>
        <div class="reference-column-7">${Number(item.count).toFixed(2)}</div>
        <div class="reference-column-7">x</div>
        <div class="reference-column-7">${Number(item.price).toFixed(2)}</div>
        <div class="reference-column-7">=</div>
        <div class="reference-column-7">${Number(item.count).toFixed(2) * Number(item.price).toFixed(2)}</div>
    </div>`;
};

// ############################## ОБРАБОТЧИКИ КЛИКОВ ПРИ ВЫВОДЕ ЗА ДЕНЬ#############
// let billStatus = '';

const onSuccessBillGet = (answer) => {
  const billCardHideHandler = () => {
    downloadPdfBtn.classList.add('d-none');
    $(billCard).unbind('hide.bs.modal', billCardHideHandler);
  };

  let {id, total, operator_name: operatorName, /* status, */ka_name: kaname, stock_name: stockName, time, type, content: goodsContent} = answer.data;
  // billStatus = status;
  billCardStock.innerHTML = stockName;
  billCardType.innerHTML = bills.BillTypesName[type];
  billCardId.innerHTML = '№' + id;
  billCardTime.innerHTML = new Date(+(time + '000')).toLocaleString();
  billCardUser.innerHTML = operatorName;
  balanceCardKontragentUser.innerHTML = kaname;
  billCardTotal.innerHTML = total;
  billCardGoods.innerHTML = `
        <div class="reference-header">
            <div class="reference-column-7">№</div>
            <div class="reference-column-7">Наименование:</div>
            <div class="reference-column-7">Кол-во</div>
            <div class="reference-column-7"></div>
            <div class="reference-column-7">Цена</div>
            <div class="reference-column-7"></div>
            <div class="reference-column-7">Сумма</div>
        </div>`;
  goodsContent.forEach((good, index) => billCardGoods.insertAdjacentHTML('beforeend', getGoodString(good, index)));
  if (+type === 0 || +type === 2) {
    billDeliveryBtn.classList.remove('d-none');
  } else {
    billDeliveryBtn.classList.add('d-none');
  }
  $(billCard).on('hide.bs.modal', billCardHideHandler);
  $(billCard).modal('show');

};


// ############################## УДАЛЕНИЕ НАКЛАДНОЙ #############
const onSuccessBillDelete = (answer) => {
  // onListEnterprisesCardReturnBtn();
  $(billCard).modal('hide');
  getDocs(docsYear.value, docsMonth.value, docsDay.value);

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: 'Накладная успешно удалена'
  };

};

const setRequestToDeleteBill = () => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.currentEnterpriseId}/${auth.allDocsOperationType}/${auth.currentBillId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessBillDelete,
  };
};

billDeleteBtn.addEventListener('click', function () {

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить накладную <b>${auth.currentBillId}</b>?`,
    submitCallback: setRequestToDeleteBill
  };

});

// ############################## ФОРМИРОВАНИЕ PDF #############
const onSuccessBillMakePdf = (answer) => {
  downloadPdfLink.href = answer.data;
  downloadPdfBtn.classList.remove('d-none');
};

const setRequestToMakePdfBill = () => {
  let date = new Date();
  let timeZoneOffset = date.getTimezoneOffset();
  timeZoneOffset *= 60;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/naklad/${auth.currentBillId}/export/pdf`,
    data: `token=${auth.data.token}&timezone=${timeZoneOffset}`,
    callbackSuccess: onSuccessBillMakePdf,
  };
};

billMakePdfBtn.addEventListener('click', function () {
  setRequestToMakePdfBill();
});

// ############################## ЗАВЕРШЕНИЕ ДОСТАВКИ #############
const onSuccessBillDelivery = (answer) => {
  $(billCard).modal('hide');
  getDocs(docsYear.value, docsMonth.value, docsDay.value);

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: 'Накладная успешно доставлена'
  };

};

const setRequestToDeliveryBill = () => {
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/${auth.allDocsOperationType}/${auth.currentBillId}`,
    data: `status=3&token=${auth.data.token}`,
    callbackSuccess: onSuccessBillDelivery,
  };
};

billDeliveryBtn.addEventListener('click', function () {

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы уверены, что доставка по данной накладной <b>${auth.currentBillId}</b> окончена? (данное действие является безвозвратным)`,
    submitCallback: setRequestToDeliveryBill
  };

});

const onBillClick = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/${auth.allDocsOperationType}/${auth.currentBillId}/info`,
    data: `token=${auth.data.token}${(auth.currentStockId) ? '&stock=' + auth.currentStockId : ''}`,
    callbackSuccess: onSuccessBillGet
  };

};
// ############################## УДАЛЕНИЕ БАЛАНСОВОЙ ОПЕРАЦИИ #############
const onSuccessBalanceDelete = (answer) => {
  $(balanceCard).modal('hide');
  getDocs(docsYear.value, docsMonth.value, docsDay.value);

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: 'Балансова операция успешно удалена'
  };

};

const setRequestToDeleteBalance = () => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.currentEnterpriseId}/balance_act/${auth.currentBillId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessBalanceDelete,
  };
};

balanceDeleteBtn.addEventListener('click', function () {

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить балансовую операцию <b>${auth.currentBillId}</b>?`,
    submitCallback: setRequestToDeleteBalance
  };

});

const onSuccessBalanceGet = (answer) => {
  let {id, comment, reason_name: reasonName, operator_name: operatorName, stock_name: stockName, time, value} = answer.data;
  balanceCardStock.innerHTML = stockName;
  balanceCardTotal.innerHTML = value;
  balanceCardReason.innerHTML = reasonName;
  balanceCardComment.innerHTML = comment;
  balanceCardId.innerHTML = '№' + id;
  balanceCardTime.innerHTML = new Date(+(time + '000')).toLocaleString();
  balanceCardUser.title = operatorName;

  $(balanceCard).modal('show');

};

const onBalanceActClick = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/balance_act/${auth.currentBillId}/info`,
    data: `token=${auth.data.token}${(auth.currentStockId) ? '&stock=' + auth.currentStockId : ''}`,
    callbackSuccess: onSuccessBalanceGet
  };
};

// ############################## ЗАГРУЖАЕМ ДОПОЛНИТЕЛЬНЫЕ НАКЛАДНЫЕ   ############


let lastId = '';
let prevData = [];

const onSuccessLoadMore = (billsData) => {
  // docsBody.innerHTML = '';
  if (docsBody.lastChild.tagName === 'BUTTON') {
    docsBody.lastChild.remove();
  }
  // lastId = billsData.data[billsData.data.length - 1].time;
  lastId = billsData.data[billsData.data.length - 1].id;

  billsData.data.sort((a, b) => b.id - a.id);
  prevData = prevData.concat(billsData.data);
  if (billsData.data[0].stock_name && auth.allDocsOperationType === 'naklad') {
    bills.drawDay(billsData.data, docsBody, onBillClick);
  } else if (billsData.data[0].stock_name && auth.allDocsOperationType === 'balance') {
    bills.drawDayBalance(billsData.data, docsBody, onBalanceActClick);
  }

  prevData = billsData.data.concat(prevData);

  docsBody.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-primary">Загрузить еще</button>');
  docsBody.lastChild.removeAttribute('disabled', 'disabled');
  docsBody.lastChild.addEventListener('click', onClickLoadMore);
};

const onClickLoadMore = (evt) => {
  evt.target.setAttribute('disabled', 'disabled');
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/documents/${auth.allDocsOperationType}/id/${lastId}/before/50`,
    data: `token=${auth.data.token}`,
    callbackSuccess: onSuccessLoadMore
  };
};
// ############################## ЗАГРУЖАЕМ ДОКУМЕНТЫ ##############################
docsReturnBtn.addEventListener('click', () => {
  if (docsDay.value !== 'all') {
    docsDay.value = 'all';
    getDocs(docsYear.value, docsMonth.value, docsDay.value);
  } else if (docsMonth.value !== 'all') {
    docsMonth.value = 'all';
    getDocs(docsYear.value, docsMonth.value, 'all');
  }
});

const onYearClick = (bill) => {
  docsMonth.value = bill.month_number - 1;
  getDocs(docsYear.value, docsMonth.value, docsDay.value);
};

const onMonthClick = (bill) => {
  drawDates(docsYear.value, docsMonth.value, 'all');
  docsDay.value = bill.day_number;
  getDocs(docsYear.value, docsMonth.value, docsDay.value);
};

const onSuccessBillsGet = (billsData) => {
  if (docsMonth.value === 'all') {
    docsReturnBtn.setAttribute('disabled', 'disabled');
  } else {
    docsReturnBtn.removeAttribute('disabled');
  }

  docsBody.innerHTML = '';
  if (billsData.data.length > 0) {

    if (billsData.data[0].month_number) {
      docsBody.innerHTML = `
      <div class="alldocs-header">
        <div class="alldocs-4-column"></div>
        <div class="alldocs-4-column">Дата</div>
        <div class="alldocs-4-column">Кол-во документов</div>
        <div class="alldocs-4-column">Сумма</div>
      </div>`;
      bills.drawYear(billsData.data, docsBody, onYearClick);

    } else if (billsData.data[0].day_number) {
      docsBody.innerHTML = `
      <div class="alldocs-header">
        <div class="alldocs-4-column"></div>
        <div class="alldocs-4-column">Дата</div>
        <div class="alldocs-4-column">Кол-во документов</div>
        <div class="alldocs-4-column">Сумма</div>
      </div>`;
      bills.drawMonth(billsData.data, docsBody, onMonthClick);

    } else if ((billsData.data[0].stock_name || billsData.data[0].stock_name === 'null') && auth.allDocsOperationType === 'naklad') {
      docsBody.innerHTML = `
      <div class="alldocs-header">
        <div class="alldocs-3-column"></div>
        <div class="alldocs-3-column">Дата</div>
        <div class="alldocs-3-column">Сумма</div>
      </div>`;
      billsData.data.sort((a, b) => +b.id - +a.id);
      bills.drawDay(billsData.data, docsBody, onBillClick);

      lastId = billsData.data[billsData.data.length - 1].id;
      prevData = billsData.data.slice(0);

      docsBody.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-primary" style="margin-top:10px">Загрузить еще</button>');
      docsBody.lastChild.addEventListener('click', onClickLoadMore);
    } else if ((billsData.data[0].stock_name || billsData.data[0].stock_name === 'null') && auth.allDocsOperationType === 'balance') {
      docsBody.innerHTML = `
      <div class="alldocs-header">
        <div class="alldocs-3-column"></div>
        <div class="alldocs-3-column">Дата</div>
        <div class="alldocs-3-column">Сумма</div>
      </div>`;
      // billsData.data.sort((a, b) => +b.id - +a.id);
      // bills.drawDay(billsData.data, docsBody, onBillClick);

      billsData.data.sort((a, b) => +a.id - +b.id);
      bills.drawDayBalance(billsData.data, docsBody, onBalanceActClick);

      lastId = billsData.data[billsData.data.length - 1].id;
      prevData = billsData.data.slice(0);

      docsBody.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-primary">Загрузить еще</button>');
      docsBody.lastChild.addEventListener('click', onClickLoadMore);
    }

  } else {
    docsBody.innerHTML = (auth.allDocsOperationType === 'naklad') ? '<div class="docs-empty-container"><img src="../img/empty_state_docs.png" alt="Накладных не обнаружено" class="docs-empty-img"></div>' : '<div class="docs-empty-container"><img src="../img/empty_state_docs.png" alt="Балансовых операций не обнаружено" class="docs-empty-img"></div>';
  }
};
const getDocs = (year, month, day, type) => {
  let interval = `year/${year}${(month !== 'all') ? '/month/' + (+month + 1) : ''}${(day !== 'all') ? '/day/' + day : ''}`;
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/documents/${auth.allDocsOperationType}/${interval}`,
    data: `token=${auth.data.token}${(auth.currentStockId !== 'all') ? '&stock=' + auth.currentStockId : ''}`,
    callbackSuccess: onSuccessBillsGet
  };
};
// ############################## ВЫСТАВЛЯЕМ ДАТЫ ##############################
const drawDates = (year, month, day) => {
  // month = month || 'all';
  // day = day || 'all';

  let thisYear = new Date().getFullYear();
  let thisMonth = month || new Date().getMonth();
  let numberOfDays = 33 - new Date(thisYear, thisMonth, 33).getDate();

  docsYear.innerHTML = '';
  docsDay.innerHTML = '';

  for (let i = START_YEAR; i <= thisYear; i++) {
    docsYear.insertAdjacentHTML('afterBegin', `<option value="${i}">${i}</option>`);
  }

  for (let i = 1; i <= numberOfDays; i++) {
    let currentDayNumber = new Date(thisYear, thisMonth, i).getUTCDay();
    let holidayFlag = (currentDayNumber === 5 || currentDayNumber === 6) ? 'class="text-danger"' : '';
    docsDay.insertAdjacentHTML('afterBegin', `<option value="${i}" ${holidayFlag}>${i}</option>`);
  }
  docsDay.insertAdjacentHTML('afterBegin', '<option value="all">---------</option>');

  docsYear.value = year || thisYear;
  docsMonth.value = thisMonth;
  docsDay.value = day || new Date().getUTCDate();
  // getDocs(docsYear.value, docsMonth.value, docsDay.value);
};

docsYear.addEventListener('change', (evt) => drawDates(evt.target.value, 'all', 'all'));
docsMonth.addEventListener('change', (evt) => drawDates(docsYear.value, evt.target.value, 'all'));
docsDay.addEventListener('change', (evt) => drawDates(docsYear.value, docsMonth.value, evt.target.value));
getDocsBtn.addEventListener('click', () => getDocs(docsYear.value, docsMonth.value, docsDay.value));

docsStocks.addEventListener('change', (evt) => {
  auth.currentStockId = evt.target.value;
  drawDates(docsYear.value, docsMonth.value, docsDay.value);
});

docsBillBtn.addEventListener('click', () => {
  auth.allDocsOperationType = 'naklad';
  docsBalanceBtn.style.opacity = 0.4;
  docsBillBtn.style.opacity = 1;
  getDocs(docsYear.value, docsMonth.value, docsDay.value);

});

docsBalanceBtn.addEventListener('click', () => {
  auth.allDocsOperationType = 'balance';
  docsBalanceBtn.style.opacity = 1;
  docsBillBtn.style.opacity = 0.4;
  getDocs(docsYear.value, docsMonth.value, docsDay.value);
});


const onSuccessStocksLoad = (docsData) => {
  docsStocks.innerHTML = docsData.data.map((item) => `<option value="${item.id}">${item.name}</option>`).join('');
  if (docsData.data.length > 1) {
    docsStocks.innerHTML += '<option value="all" selected>Все склады</option';
  }
};


const getStocks = () => {
  auth.currentStockId = 'all';

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/stock`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessStocksLoad
  };
};

export default {

  start() {
    docsList.addEventListener('click', getStocks);
    drawDates();
    getDocs(docsYear.value, docsMonth.value, docsDay.value);
    auth.allDocsOperationType = 'naklad';
    docsBalanceBtn.style.opacity = 0.4;
  },

  onBillClick,
  onBalanceActClick,

  stop() {
    docsList.removeEventListener('click', getStocks);
  }
};
