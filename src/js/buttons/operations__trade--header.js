import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

let stocksList = document.querySelector('#operations-purchase-stocks-list');
let header = document.querySelector('#operation-header');

export default {
  setHeader() {
    let head;
    let img;

    let type = stor.operationTradeType;
    switch (type) {
    case '1':
      head = 'ЗАКУПКА';
      img = 'img/admission.png';
      break;
    case '-1':
      head = 'ПРОДАЖА';
      img = 'img/sale.png';
      break;
    }

    header.innerHTML = '';
    header.innerHTML = markup.header(head, img);
  },

  setStocksList(stocks) {

    let fragment = document.createDocumentFragment();

    stocks.forEach((el) => {
      let option = document.createElement('option');
      option.value = el.id;
      option.innerHTML = el.name;

      fragment.appendChild(option);
    });
    stocksList.appendChild(fragment);
  },
};
