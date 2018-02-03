// import xhr from '../tools/xhr.js';
// import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import searchBarcode from './catalog__search-barcode--valid.js';
// import goodsCard from './catalog-groups-goods.js';
// import search from './catalog__search.js';

// const listSearchBody = document.querySelector('#list-search-card-body');
const listSearchInput = document.querySelector('#list-search-input');
const listSearchBarcodeBtn = document.querySelector('#list-search-card-barcode-btn');
const universalAddModal = document.querySelector('#universal-add');

// const loaderSpinnerId = 'loader-cards';
// const loaderSpinnerMessage = 'Загрузка';
// const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

// поиск по штрихкоду
// const onBarcodeSuccessLoad = (barcodeResult) => {
//   document.querySelector(`#${loaderSpinnerId}`).remove();

//   // чОрное колдовство с автооткрытием карточки при одном найденном варианте
//   $('#universal-add').on('hidden.bs.modal', function (e) {
//     if (barcodeResult.data.length === 1) {
//       auth.currentGoodId = barcodeResult.data[0].id;
//       goodsCard.fill();
//       barcodeResult.data = 0;
//     } else if (barcodeResult.data.length > 1) {
//       search.drawResult(barcodeResult.data);
//     }
//   });
// };

// const setRequestToFindBarcode = (barcode) => {
//   // listSearchBody.innerHTML = loaderSpinnerMarkup;
//   xhr.request = {
//     metod: 'POST',
//     url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_search`,
//     data: `token=${auth.data.token}&barcode=${barcode}`,
//     // callbackSuccess: onBarcodeSuccessLoad,
//   };
// };
const onListSearchBarcodeBtn = () => {
  listSearchInput.value = '';
  toolsMarkup.runUniversalAdd = {
    title: 'Поиск по штрихкоду',
    inputLabel: 'Штрихкод',
    inputPlaceholder: 'введите штрихкод',
    submitBtnName: 'Поиск',
    // submitCallback: setRequestToFindBarcode
  };
  searchBarcode.start(universalAddModal);
};

export default {
  start() {
    listSearchBarcodeBtn.addEventListener('click', onListSearchBarcodeBtn);
  }
};
