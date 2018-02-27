import auth from '../tools/storage.js';

const BillTypes = {
  'type0': 'suppliers',
  'type1': 'admission',
  'type2': 'buyers',
  'type3': 'sale',
  'type8': 'ic_my_production',
};

const getYearElement = (item, index) => {
  return `
  <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
    <div class="media">
      <div class="media-body">
        <b> Номер месяца: </b>${item.month_number}
        <b> Время (первая) </b>${new Date(+(item.doc_time_first + '000')).toLocaleString()}
        <b> Время (последняя) </b>${new Date(+(item.doc_time_last + '000')).toLocaleString()}
        <b> Количество документов: </b>${item.count_documents}
        <b> Всего: </b>${item.total}
      </div>
    </div>`;
};

const getMonthElement = (item, index) => {
  return `
  <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
    <div class="media">
      <div class="media-body">
        <b> Номер дня: </b>${item.day_number}
        <b> Время (первая) </b>${new Date(+(item.doc_time_first + '000')).toLocaleString()}
        <b> Время (последняя) </b>${new Date(+(item.doc_time_last + '000')).toLocaleString()}
        <b> Количество документов: </b>${item.count_documents}
      </div>
    </div>`;
};

const getDayElement = (item, index) => {
  return `
  <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
    <div class="media">
      <img class="mr-3" src="img/${BillTypes['type' + item.type]}.png" width="30" alt="">
      <div class="media-body">
        <b>ID: </b>${item.id}
        <b> Статус: </b>${item.status}
        <b> ID склада: </b>${item.stock_id}
        <b> Имя склада: </b>${item.stock_name}
        <b> Время: </b>${new Date(+(item.time + '000')).toLocaleString()}
        <b> Всего: </b>${item.total}
        <b> Тип: </b>${item.type}
      </div>
    </div>`;
};

const getDayBalanceElement = (item, index) => {
  return `
  <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
    <div class="media">

      <div class="media-body">
        <b>ID: </b>${item.id}
        <b> ID склада: </b>${item.stock_id}
        <b> Имя склада: </b>${item.stock_name}
        <b> Время: </b>${new Date(+(item.time + '000')).toLocaleString()}
        <b> Всего: </b>${item.total}
        <b> Комментарий: </b>${item.comment}
        <b> Основание: </b>${item.reason}
      </div>
    </div>`;
};

const markup = {


  drawBillsYear(billsData, container, handler) {
    billsData.forEach((group, index) => {
      container.insertAdjacentHTML('beforeend', getYearElement(group, index));
    });
  },

  drawBillsMonth(billsData, container, handler) {
    billsData.forEach((bill, index) => {
      container.insertAdjacentHTML('beforeend', getMonthElement(bill, index));
    });
  },

  drawBillsDay(billsData, container, handler) {
    billsData.forEach((bill, index) => {
      container.insertAdjacentHTML('beforeend', getDayElement(bill, index));

      container.lastChild.addEventListener('click', function () {
        auth.currentBillId = bill.id;
        handler();
      });

    });
  },

  drawBalanceDay(billsData, container, handler) {
    billsData.forEach((bill, index) => {
      container.insertAdjacentHTML('beforeend', getDayBalanceElement(bill, index));

      container.lastChild.addEventListener('click', function () {
        auth.currentBillId = bill.id;
        handler();
      });

    });
  },
};

export default {
  drawYear: markup.drawBillsYear,
  drawMonth: markup.drawBillsMonth,
  drawDay: markup.drawBillsDay,
  drawDayBalance: markup.drawBalanceDay,
  BillTypes
};
