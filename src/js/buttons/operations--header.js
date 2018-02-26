import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

let stocksListTrade = document.querySelector('#operations-purchase-stocks-list');
let stocksListInventory = document.querySelector('#operation-inventory-stocks-list');
let header = document.querySelector('#operation-header');

export default {
  setHeader() {
    let head;
    let img;

    let type = stor.operationTradeType;
    switch (type) {
    case '0':
      head = 'ЗАКУПКА';
      img = 'img/admission.png';
      break;
    case '1':
      head = 'ПРОДАЖА';
      img = 'img/sale.png';
      break;
    case '7':
      head = 'ИНВЕНТАРИЗАЦИЯ';
      img = 'img/inventory.png';
      break;
    }


    header.innerHTML = '';
    header.innerHTML = markup.header(head, img);
  },

  setStocksList(stocks) {
    let data = stor.data;

    let fragment = document.createDocumentFragment();

    stocks.forEach((el) => {
      let option = document.createElement('option');
      option.value = el.id;
      option.innerHTML = el.name;

      if (el.id === data.currentStock) {
        option.selected = true;
      }

      fragment.appendChild(option);
    });

    let stocksList = (stor.operationTradeType === '7') ? stocksListInventory : stocksListTrade;

    stocksList.appendChild(fragment);
  },
};
