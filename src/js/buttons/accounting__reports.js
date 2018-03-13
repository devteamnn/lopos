import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import groupsList from './universal-groups-list.js';
// import 'date-input-polyfill';
const reportsList = document.querySelector('#list-reports-list');
const reportsGroupMainSwitch = document.querySelector('#report-groups-main-switch');
const reportsGroupMainSwitchTurn = document.querySelector('#report-groups-turn-main-switch');
const reportsDashboard = document.querySelector('#reports-dashboard');

const reportsGoodsLeft = document.querySelector('#report-goods-left');
const reportsGoodsLeftModal = document.querySelector('#report-goods-left-modal');
const reportsGoodsLeftModalStock = document.querySelector('#report-goods-left-modal-stock');
const reportsGoodsLeftModalSwitchesBody = document.querySelector('#report-goods-left-modal-switch');
const reportsGoodsLeftModalBody = document.querySelector('#report-goods-left-modal-body');
const reportsGoodsLeftModalPDFBtn = document.querySelector('#report-goods-left-modal-pdf');
const reportsGoodsLeftModalExcelBtn = document.querySelector('#report-goods-left-modal-excel');

const reportsGoodsTurn = document.querySelector('#report-goods-turn');
const reportsGoodsTurnModal = document.querySelector('#report-goods-turn-modal');
const reportsGoodsTurnModalStock = document.querySelector('#report-goods-turn-modal-stock');
const reportsGoodsTurnModalBody = document.querySelector('#report-goods-turn-modal-body');
const reportsGoodsTurnModalPDFBtn = document.querySelector('#report-goods-turn-modal-pdf');
const reportsGoodsTurnModalExcelBtn = document.querySelector('#report-goods-turn-modal-excel');

const reportTurnFrom = document.querySelector('#report-turn-from');
const reportTurnTo = document.querySelector('#report-turn-to');

const reportsGoodsProfit = document.querySelector('#report-profit-retail');
const reportsGoodsProfitModal = document.querySelector('#report-goods-profit-modal');
const reportsGoodsProfitModalStock = document.querySelector('#report-goods-profit-modal-stock');
const reportsGoodsProfitModalPDFBtn = document.querySelector('#report-goods-profit-modal-pdf');
const reportsGoodsProfitModalExcelBtn = document.querySelector('#report-goods-profit-modal-excel');

const reportProfitFrom = document.querySelector('#report-profit-from');
const reportProfitTo = document.querySelector('#report-profit-to');

const reportLink = document.querySelector('#report-link');
const reportLinkGoogle = document.querySelector('#report-link-google');
const reportLinkTurn = document.querySelector('#report-link-turn');
const reportLinkTurnGoogle = document.querySelector('#report-link-turn-google');
const reportLinkProfit = document.querySelector('#report-link-profit');
const reportLinkProfitGoogle = document.querySelector('#report-link-profit-google');

const reportsStocks = document.querySelector('#reports-stocks');

// ############################## РАЗМЕТКА ДАШБОРДА #############
const dashboardTypes = {
  money: 'Баланс',
  form: 'Закупки',
  proceeds: 'Выручка',
  profit: 'Кол-во продаж',
  purchase: 'Прибыль'
};

const getDashboardItem = (item) => {
  console.log(item);
  return `
    <div class="dashboard-item">
      <div class="dashboard-status"></div>
      <div>
        <p>${dashboardTypes[item[0]]}</p>
        <span>${item[1]}</span>
      </div>
    </div>`;
};

// ############################## ОТЧЕТ / ОСТАТОК ТОВАРА     ##############################

const onPDFLoadSuccess = (data) => {
  console.log(data);

  // reportLink.href = data.data;
  // reportLink.innerHTML = `Скачать ${auth.currentReportType}`;

  // reportLinkGoogle.href = `https://docs.google.com/viewer?url=${data.data}&embedded=false`;
  // reportLinkGoogle.innerHTML = `Смотреть ${auth.currentReportType} на Google `;
  reportLink.classList.remove('disabled');
  reportLinkGoogle.classList.remove('disabled');
  reportLink.href = data.data;
  reportLinkGoogle.href = `https://docs.google.com/viewer?url=${data.data}&embedded=false`;
  // reportLink.innerHTML = '<img src="./img/report-download.png" style="height: 34px;" title="Скачать на компьютер">';
  // reportLinkGoogle.innerHTML = '<img src="./img/report-google.png" style="height: 34px;" title="Смотреть на Google">';
};

const getReportLink = () => {
  console.log('stock-->', auth.currentStockId);

  let params = [];
  let listOfGroups = [];

  reportsGoodsLeftModalSwitchesBody.querySelectorAll('.report-goods-left-modal-switch').forEach((switchParam) => {
    if (switchParam.checked) {
      params.push(switchParam.value);
    }
  });

  reportsGoodsLeftModalBody.querySelectorAll('.report-groups-switch').forEach((switchGroups) => {
    if (switchGroups.checked) {
      listOfGroups.push(switchGroups.value);
    }
  });

  console.log('parameters-->', params);
  console.log('listOfGroups-->', listOfGroups);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/report/remains/export/${auth.currentReportType}`,
    data: `token=${auth.data.token}&parameters=[${params}]&list_of_groups=[${listOfGroups}]${(auth.currentStockId === 'all' ? '' : '&stock=' + auth.currentStockId)}`,
    callbackSuccess: onPDFLoadSuccess
  };
};

reportsGoodsLeftModalPDFBtn.addEventListener('click', () => {
  auth.currentReportType = 'pdf';
  reportLink.classList.add('disabled');
  reportLinkGoogle.classList.add('disabled');
  getReportLink();
});

reportsGoodsLeftModalExcelBtn.addEventListener('click', () => {
  auth.currentReportType = 'excel';
  reportLink.classList.add('disabled');
  reportLinkGoogle.classList.add('disabled');
  getReportLink();
});

reportsGroupMainSwitch.addEventListener('change', (evt) => {
  document.querySelectorAll('.report-groups-switch').forEach((switchElement) => {
    switchElement.checked = evt.target.checked;
  });
  console.log(evt.target.checked);
});

const onSuccessGoodsLeftLoad = (goodData) => {
  console.log(goodData);
  $(reportsGoodsLeftModal).modal('show');
  reportsGoodsLeftModalStock.value = reportsStocks.value;

  groupsList.drawReports(goodData.data, reportsGoodsLeftModalBody, null);
};

const onReportsGoodsLeftClick = () => {
  reportLink.classList.add('disabled');
  reportLinkGoogle.classList.add('disabled');
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/group`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGoodsLeftLoad
  };
};

reportsGoodsLeft.addEventListener('click', onReportsGoodsLeftClick);

// ############################## ОТЧЕТ / ОБОРОТ ТОВАРА      ##############################

const onPDFLoadSuccessTurn = (data) => {
  console.log(data);

  reportLinkTurn.href = data.data;
  reportLinkTurn.classList.remove('disabled');
  reportLinkTurnGoogle.classList.remove('disabled');
  reportLinkTurnGoogle.href = `https://docs.google.com/viewer?url=${data.data}&embedded=false`;

};

const getReportLinkTurn = () => {
  console.log('stock-->', auth.currentStockId);
  let params = [];
  let listOfGroups = [];

  document.querySelectorAll('.report-goods-turn-modal-switch').forEach((switchParam) => {
    if (switchParam.checked) {
      params.push(switchParam.value);
    }
  });

  reportsGoodsTurnModalBody.querySelectorAll('.report-groups-switch').forEach((switchGroups) => {
    if (switchGroups.checked) {
      listOfGroups.push(switchGroups.value);
    }
  });

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/report/turnover/export/${auth.currentReportType}`,
    data: `token=${auth.data.token}&parameters=[${params}]&list_of_groups=[${listOfGroups}&time_start=${Date.parse(reportTurnFrom.value) / 1000}&time_end=${Date.parse(reportTurnTo.value) / 1000}${(auth.currentStockId === 'all' ? '' : '&stock=' + auth.currentStockId)}`,
    callbackSuccess: onPDFLoadSuccessTurn
  };
};

reportsGoodsTurnModalPDFBtn.addEventListener('click', () => {
  auth.currentReportType = 'pdf';
  reportLinkTurn.classList.add('disabled');
  reportLinkTurnGoogle.classList.add('disabled');
  getReportLinkTurn();
});

reportsGoodsTurnModalExcelBtn.addEventListener('click', () => {
  auth.currentReportType = 'excel';
  reportLinkTurn.classList.add('disabled');
  reportLinkTurnGoogle.classList.add('disabled');
  getReportLinkTurn();
});

reportsGroupMainSwitchTurn.addEventListener('change', (evt) => {
  reportsGoodsTurnModalBody.querySelectorAll('.report-groups-switch').forEach((switchElement) => {
    switchElement.checked = evt.target.checked;
  });
  console.log(evt.target.checked);
});

const onSuccessGoodsTurnLoad = (goodData) => {
  console.log(goodData);
  $(reportsGoodsTurnModal).modal('show');
  reportLinkTurn.classList.add('disabled');
  reportLinkTurnGoogle.classList.add('disabled');
  reportsGoodsTurnModalStock.value = reportsStocks.value;

  groupsList.drawReports(goodData.data, reportsGoodsTurnModalBody, null);
};

const onReportsGoodsTurnClick = () => {
  // reportLinkTurn.innerHTML = '';
  reportTurnFrom.value = new Date().toISOString().slice(0, 8) + '01';
  reportTurnTo.value = new Date().toISOString().slice(0, 10);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/group`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGoodsTurnLoad
  };
};

reportsGoodsTurn.addEventListener('click', onReportsGoodsTurnClick);
// ############################## ОТЧЕТ / ПРИБЫЛЬ С РОЗНИЦЫ  ##############################

const onPDFLoadSuccessProfit = (data) => {
  reportLinkProfit.classList.remove('disabled');
  reportLinkProfitGoogle.classList.remove('disabled');
  reportLinkProfit.href = data.data;
  reportLinkProfitGoogle.href = `https://docs.google.com/viewer?url=${data.data}&embedded=false`;
};

const getReportLinkProfit = () => {
  console.log('stock-->', auth.currentStockId);
  let params = [];

  document.querySelectorAll('.report-goods-profit-modal-switch').forEach((switchParam) => {
    if (switchParam.checked) {
      params.push(switchParam.value);
    }
  });

  console.log('parameters-->', params);

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/report/profit/export/${auth.currentReportType}`,
    data: `token=${auth.data.token}&parameters=[${params}]&ime_start=${Date.parse(reportProfitFrom.value) / 1000}&time_end=${Date.parse(reportProfitTo.value) / 1000}${(auth.currentStockId === 'all' ? '' : '&stock=' + auth.currentStockId)}`,
    callbackSuccess: onPDFLoadSuccessProfit
  };
};

reportsGoodsProfitModalPDFBtn.addEventListener('click', () => {
  auth.currentReportType = 'pdf';
  reportLinkProfit.classList.add('disabled');
  reportLinkProfitGoogle.classList.add('disabled');
  getReportLinkProfit();
});

reportsGoodsProfitModalExcelBtn.addEventListener('click', () => {
  auth.currentReportType = 'excel';
  reportLinkProfit.classList.add('disabled');
  reportLinkProfitGoogle.classList.add('disabled');
  getReportLinkProfit();
});

const onReportsProfitClick = () => {
  // reportLinkProfit.innerHTML = '';
  // reportLinkProfitGoogle.innerHTML = '';
  $(reportsGoodsProfitModal).modal('show');
  reportsGoodsProfitModalStock.value = reportsStocks.value;
  reportLinkProfit.classList.add('disabled');
  reportLinkProfitGoogle.classList.add('disabled');
  reportProfitFrom.value = new Date().toISOString().slice(0, 8) + '01';
  reportProfitTo.value = new Date().toISOString().slice(0, 10);
};

reportsGoodsProfit.addEventListener('click', onReportsProfitClick);


reportsStocks.addEventListener('change', (evt) => {
  auth.currentStockId = evt.target.value;
  getReports();
});

const onChangeStockModal = (evt) => {
  auth.currentStockId = evt.target.value;
};

reportsGoodsLeftModalStock.addEventListener('change', onChangeStockModal);
reportsGoodsTurnModalStock.addEventListener('change', onChangeStockModal);
reportsGoodsProfitModalStock.addEventListener('change', onChangeStockModal);

const onSuccessReportsLoad = (reportsData) => {
  console.log(reportsData);
  let dashboard = {
    money: reportsData.data.balance_money,
    form: reportsData.data.today_count_forms,
    proceeds: reportsData.data.today_total_proceeds,
    profit: reportsData.data.today_total_profit,
    purchase: reportsData.data.today_total_purchase,
  };

  if (auth.currentStockId === 'all') {

    reportsStocks.innerHTML = reportsData.data.all_stocks.map((item) => `<option value="${item.id}">${item.name}</option>`).join('');
    reportsGoodsLeftModalStock.innerHTML = reportsData.data.all_stocks.map((item) => `<option value="${item.id}">${item.name}</option>`).join('');
    reportsGoodsTurnModalStock.innerHTML = reportsData.data.all_stocks.map((item) => `<option value="${item.id}">${item.name}</option>`).join('');
    reportsGoodsProfitModalStock.innerHTML = reportsData.data.all_stocks.map((item) => `<option value="${item.id}">${item.name}</option>`).join('');

    if (reportsData.data.all_stocks.length > 1) {
      reportsStocks.innerHTML += '<option value="all" selected>Все склады</option';
      reportsGoodsLeftModalStock.innerHTML += '<option value="all" selected>Все склады</option';
      reportsGoodsTurnModalStock.innerHTML += '<option value="all" selected>Все склады</option';
      reportsGoodsProfitModalStock.innerHTML += '<option value="all" selected>Все склады</option';
    }
  }

  reportsDashboard.innerHTML = Object.entries(dashboard).map((dash) => getDashboardItem(dash)).join('');

};

const getReports = () => {

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}/business/${auth.data.currentBusiness}/dashboard`,
    data: `view_last=0&token=${auth.data.token}${(auth.currentStockId === 'all' ? '' : '&stock=' + auth.currentStockId)}`,
    callbackSuccess: onSuccessReportsLoad
  };
};

export default {

  start() {
    reportsList.addEventListener('click', getReports);
    auth.currentStockId = 'all';
  },

  stop() {
    reportsList.removeEventListener('click', getReports);
  },
  goodsLeft: onReportsGoodsLeftClick
};
