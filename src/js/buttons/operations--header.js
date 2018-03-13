// import markup from './../markup/operation__trade.js';
import stor from './../tools/storage.js';

let stocksListPurchase = document.querySelector('#operations-purchase-stocks-list');
let stocksListSale = document.querySelector('#operations-sale-stocks-list');
let stocksListInventory = document.querySelector('#operation-inventory-stocks-list');

const kontragentsListPurchase = document.querySelector('#operations-purchase-kontragents-list');
const kontragentsListSale = document.querySelector('#operations-sale-kontragents-list');
const kontragentsListInventory = document.querySelector('#operation-inventory-kontragents-list');

export default {

  setStocksList(stocks) {
    let data = stor.data;
    let fragment = document.createDocumentFragment();

    let stocksList;

    switch (stor.operationTradeType) {
    case '0':
      stocksList = stocksListPurchase;
      break;
    case '1':
      stocksList = stocksListSale;
      break;
    case '7':
      stocksList = stocksListInventory;
      break;
    }

    stocksList.innerHTML = '';

    stocks.forEach((el) => {
      let option = document.createElement('option');
      option.value = el.id;
      option.innerHTML = el.name;

      if (el.id === data.currentStock) {
        option.selected = true;
      }

      fragment.appendChild(option);
    });

    stocksList.appendChild(fragment);
  },

  setKontragentList(kontragents) {
    let kontragentsList;

    switch (stor.operationTradeType) {
    case '0':
      kontragentsList = kontragentsListPurchase;
      break;
    case '1':
      kontragentsList = kontragentsListSale;
      break;
    case '7':
      kontragentsList = kontragentsListInventory;
      break;
    }

    kontragentsList.innerHTML = '';

    kontragents.forEach((el) => {
      kontragentsList.innerHTML = kontragentsList.innerHTML + `<option value="${el.id}">${el.name}</option>`;
    });
  }
};
