import auth from '../tools/storage.js';

const BillTypes = {
  'type0': 'suppliers',
  'type1': 'admission',
  'type2': 'buyers',
  'type3': 'sale',
  'type8': 'ic_my_production',
  'type15': 'inventory'
};

const BillTypesName = {
  '0': 'Доставка-поступление',
  '1': 'Поступление',
  '2': 'Доставка-продажа',
  '3': 'Продажа',
  '8': 'Производство',
  '15': 'Инвентаризация'
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

  <div class="alldocs-row">
    <div class="alldocs-row-3-column">
      <img src="img/ic_agree.png" alt="">
      <span>${months[item.month_number - 1]} ${document.querySelector('#docs-year').value} года</span>
    </div>
    <div class="alldocs-row-3-column">
      <span>${item.count_documents}</span><br>
    </div>
    <div class="alldocs-row-3-column">
      <span>${item.total}</span>
    </div>
`;

};

const getMonthElement = (item, index) => {
  return `

  <div class="alldocs-row">
    <div class="alldocs-row-3-column">
      <img src="img/ic_agree.png" alt="">
      <span></b>${(+item.day_number < 10) ? '0' + item.day_number : item.day_number}.${(+document.querySelector('#docs-month').value + 1) < 10 ? '0' + (+document.querySelector('#docs-month').value + 1) : (+document.querySelector('#docs-month').value + 1)}.${document.querySelector('#docs-year').value}</span>
    </div>
    <div class="alldocs-row-3-column">
      <span>${item.count_documents}</span><br>
    </div>
    <div class="alldocs-row-3-column">
      <span>${item.total}</span>
    </div>
`;

};

const getDayElement = (item, index) => {
  return `

  <div class="alldocs-row">
    <div class="alldocs-row-2-column">
      <div style="background-color: #${item.operator_color};   border-radius: 10px 10px 10px 10px;" width="60px;" >
          <img  src="img/user-male-filled-32.png" style="margin-left:1px;   width="24px; height=24;"  >
          <span style="margin-right:2px; color:#ffffff;">${item.operator_id}</span>
      </div>

      <img  class="alldocs-row-2-column-img" src="img/${BillTypes['type' + item.type]}.png"  alt="">
      <span> № ${item.id} в ${new Date(+(item.time + '000')).toLocaleTimeString()}</span>
    </div>
    
    <div class="alldocs-row-2-column">
      <span>${item.total}</span>
    </div>
`;

};

const getDayBalanceElement = (item, index) => {
  return `

  <div class="alldocs-row">
    <div class="alldocs-row-2-column">
     <div style="background-color: #${item.operator_color};   border-radius: 10px 10px 10px 10px;" width="60px;" >
          <img  src="img/user-male-filled-32.png" style="margin-left:1px;   width="24px; height=24;"  >
          <span style="margin-right:2px; color:#ffffff;">${item.operator_id}</span>
      </div>


      <img class="alldocs-row-2-column-img" src="img/${(+item.total < 0) ? 'expenses' : 'revenue'}.png" width="30" alt="">
      <span> № ${item.id} в ${new Date(+(item.time + '000')).toLocaleTimeString()}</span>
    </div>
    <div class="alldocs-row-2-column">
      <span>${item.total}</span>
    </div>
   `;

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
  BillTypes,
  BillTypesName
};
