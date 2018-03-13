import auth from '../tools/storage.js';

const BillTypes = {
  'type0': 'suppliers',
  'type1': 'admission',
  'type2': 'buyers',
  'type3': 'sale',
  'type8': 'ic_my_production',
};

const months = {
  '11': 'Декабрь',
  '10': 'Ноябрь',
  '9': 'Октябрь',
  '8': 'Сентябрь',
  '7': 'Август',
  '6': 'Июль',
  '5': 'Июнь',
  '4': 'Май',
  '3': 'Апрель',
  '2': 'Март',
  '1': 'Февраль',
  '0': 'Январь'
};

const getYearElement = (item, index) => {
  return `

  <div class="alldocs-year">
    <div class="alldocs-year-column">
      <img src="img/ic_agree.png" alt="">
      <span>${months[item.month_number - 1]} ${document.querySelector('#docs-year').value} года</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.total}</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.count_documents}</span><br>
    </div>`;

};

const getMonthElement = (item, index) => {
  return `

  <div class="alldocs-year">
    <div class="alldocs-year-column">
      <img src="img/ic_agree.png" alt="">
      <span></b>${(+item.day_number < 10) ? '0' + item.day_number : item.day_number}.${(+document.querySelector('#docs-month').value + 1) < 10 ? '0' + (+document.querySelector('#docs-month').value + 1) : (+document.querySelector('#docs-month').value + 1)}.${document.querySelector('#docs-year').value}</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.total}</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.count_documents}</span><br>
    </div>`;

};

const getDayElement = (item, index) => {
  return `

  <div class="alldocs-year">
    <div class="alldocs-year-column">
      <img class="mr-3" src="img/${BillTypes['type' + item.type]}.png" width="30" alt="">
      <span> № ${item.id} в ${new Date(+(item.time + '000')).toLocaleTimeString()}</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.total}</span>
    </div>
    <div class="alldocs-year-column">
      <img class="mr-3 rounded-circle" src="img/user-male-filled-32.png" style="background-color: #${item.operator_color}" width="30" alt="">
    </div>`;

};

const getDayBalanceElement = (item, index) => {
  return `

  <div class="alldocs-year">
    <div class="alldocs-year-column">
      <img class="mr-3" src="img/${(+item.total < 0) ? 'expenses' : 'revenue'}.png" width="30" alt="">
      <span> № ${item.id} в ${new Date(+(item.time + '000')).toLocaleTimeString()}</span>
    </div>
    <div class="alldocs-year-column">
      <span>${item.total}</span>
    </div>
    <div class="alldocs-year-column">
      <img class="mr-3 rounded-circle" src="img/user-male-filled-32.png" style="background-color: #${item.operator_color}" width="30" alt="">
    </div>`;

};

const markup = {


  drawBillsYear(billsData, container, handler) {
    billsData.forEach((bill, index) => {
      container.insertAdjacentHTML('beforeend', getYearElement(bill, index));
      container.lastChild.addEventListener('click', function () {
        handler(bill);
      });
    });
  },

  drawBillsMonth(billsData, container, handler) {
    billsData.forEach((bill, index) => {
      container.insertAdjacentHTML('beforeend', getMonthElement(bill, index));
      container.lastChild.addEventListener('click', function () {
        handler(bill);
      });
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
