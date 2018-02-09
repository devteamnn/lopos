
import toolsMarkup from '../markup/tools.js';
import searchBarcode from './catalog__search-barcode--valid.js';

const listSearchInput = document.querySelector('#list-search-input');
const listSearchBarcodeBtn = document.querySelector('#list-search-card-barcode-btn');
const universalAddModal = document.querySelector('#universal-add');

const onListSearchBarcodeBtn = () => {
  listSearchInput.value = '';
  toolsMarkup.runUniversalAdd = {
    title: 'Поиск по штрихкоду',
    inputLabel: 'Штрихкод',
    inputPlaceholder: 'введите штрихкод',
    submitBtnName: 'Поиск',
  };
  searchBarcode.start(universalAddModal);
};

export default {
  start() {
    listSearchBarcodeBtn.addEventListener('click', onListSearchBarcodeBtn);
  }
};
