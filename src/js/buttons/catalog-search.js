import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import searchMarkup from '../markup/catalog-cards.js';
import toolsMarkup from '../markup/tools.js';
import groupsMarkup from '../markup/catalog-groups.js';
import goodsCard from './catalog-groups-goods.js';

import keywordsUniversal from './universal-keywords.js';

const listSearch = document.querySelector('#list-search-list');
const listSearchBody = document.querySelector('#list-search-card-body');
const listSearchBtn = document.querySelector('#list-search-btn');
const listSearchForm = document.querySelector('#list-search-form');
const listSearchInput = document.querySelector('#list-search-input');

const listSearchKeywordsBtn = document.querySelector('#list-search-keywords-btn');
const listSearchKeywordsModal = document.querySelector('#search-card-keywords');
const listSearchKeywordsModalBody = document.querySelector('#search-card-keywords-body');
const listSearchKeywordsResetBtn = document.querySelector('#list-search-card-reset-btn');
const listSearchKeywordsModalSubmit = document.querySelector('#search-card-keywords-submit');

const listSearchBarcodeBtn = document.querySelector('#list-search-card-barcode-btn');

const loaderSpinnerId = 'loader-cards';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);


let fullSearch = [];

const drawResult = (selectedData) => {
  listSearchBody.innerHTML = '';
  if (selectedData.length) {
    selectedData.forEach((item, index) => listSearchBody.insertAdjacentHTML('beforeend', groupsMarkup.getGoodString(item, index)));
  } else {
    listSearchBody.innerHTML = `Не завезли пока <b>${listSearchInput.value}</b>, хотя и ждали намедни...`;
  }
};

const onlistSearchFormSubmit = (evt) => {
  evt.preventDefault();
  listSearchBody.innerHTML = '';
  let selectedData = [];
  console.log(!listSearchInput.value);
  if (!listSearchInput.value) {
    listSearchBody.innerHTML = 'Ну скажите хоть что-нибудь...';
  } else {
    fullSearch.data.forEach((item) => {
      if (item.name.toLowerCase().indexOf(listSearchInput.value.toLowerCase()) !== -1) {
        selectedData.push(item);
      }
    });
    drawResult(selectedData);

  }
};

const onSuccessFullSearchLoad = (fullSearchLoad) => {
  console.log(fullSearchLoad);
  fullSearch = fullSearchLoad;
  document.querySelector(`#${loaderSpinnerId}`).remove();
  if (fullSearchLoad.status === 271) {
    listSearchBody.innerHTML = fullSearchLoad.message;
  }
  listSearchBody.innerHTML = '';
};

const getFullSearch = () => {
  listSearchBody.innerHTML = loaderSpinnerMarkup;
  console.log(listSearchInput);

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_full_list`,
    data: `token=${auth.data.token}&name=${listSearchInput.value}`,
    callbackSuccess: onSuccessFullSearchLoad,
  };
};

const onSuccessKeywordSearch = (keywordSearchData) => {
  console.log(keywordSearchData);
  if (keywordSearchData.status === 271) {
    listSearchBody.innerHTML = 'Ключевые слова: ' + keywordSearchData.message;
    getFullSearch();
  } else {
    listSearchBody.innerHTML = '';
    drawResult(keywordSearchData.data);
    fullSearch = keywordSearchData;
    listSearchInput.value = '';
  }
};

let selectedKeywords = [];

listSearchKeywordsModalSubmit.addEventListener('click', () => {
  listSearchBody.innerHTML = loaderSpinnerMarkup;
  let selectedKeywordsNodes = listSearchKeywordsModalBody.querySelectorAll('.keyword:not(.keyword__mute)');
  selectedKeywords = [];
  selectedKeywordsNodes.forEach((keywordNode) => selectedKeywords.push(keywordNode.dataset.keywordId));
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_search`,
    data: `token=${auth.data.token}&tags=[${selectedKeywords}]`,
    callbackSuccess: onSuccessKeywordSearch,
  };
});

// обработчик клика по ключевому слову (пока внутри карточки связей "товар-слово")
const onKeywordClick = (evt) => evt.target.classList.toggle('keyword__mute');

// установка прозрачности
const keywordModificator = (keywordId, keywordNode) => {
  if (selectedKeywords.every((tagItem) => (tagItem !== keywordId))) {
    keywordNode.classList.add('keyword__mute');
  }
};

listSearchKeywordsBtn.addEventListener('click', () => {
  keywordsUniversal.downloadAndDraw(listSearchKeywordsModalBody, onKeywordClick, keywordModificator);
  $(listSearchKeywordsModal).modal('show');
  listSearchKeywordsResetBtn.removeAttribute('disabled');
  // keywordsUniversal.draw(listSearchBody);
});

listSearchKeywordsResetBtn.addEventListener('click', () => {
  selectedKeywords = [];
  listSearchInput.value = '';
  getFullSearch();
  listSearchKeywordsResetBtn.setAttribute('disabled', 'disabled');
});

const onBarcodeSuccessLoad = (barcodeResult) => {
  document.querySelector(`#${loaderSpinnerId}`).remove();
  $('#universal-add').on('hidden.bs.modal', function (e) {
    console.log(barcodeResult.data.length);
    if (barcodeResult.data.length === 1) {
      auth.currentGoodId = barcodeResult.data[0].id;
      goodsCard.fill();
      barcodeResult.data = 0;
    } else if (barcodeResult.data.length > 1) {
      drawResult(barcodeResult.data);
    }
  });
};

const setRequestToFindBarcode = (barcode) => {
  listSearchBody.innerHTML = loaderSpinnerMarkup;
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_search`,
    data: `token=${auth.data.token}&barcode=${barcode}`,
    callbackSuccess: onBarcodeSuccessLoad,
  };
};

listSearchBarcodeBtn.addEventListener('click', function () {
  selectedKeywords = [];
  listSearchInput.value = '';
  toolsMarkup.runUniversalAdd = {
    title: 'Поиск по штрихкоду',
    inputLabel: 'Штрихкод',
    inputPlaceholder: 'введите штрихкод',
    submitBtnName: 'Поиск',
    submitCallback: setRequestToFindBarcode
  };
});

const onListSearchBodyClick = (evt) => {

  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.goodId) {
    currentStringElement = currentStringElement.parentNode;
  }

  auth.currentGoodId = currentStringElement.dataset.goodId;
  goodsCard.fill();
};

listSearchBody.addEventListener('click', onListSearchBodyClick);


export default {

  start() {
    // listSearchBtn.addEventListener('click', getSearch);
    // listSearchForm.addEventListener('submit', getSearch);
    listSearchBtn.addEventListener('click', onlistSearchFormSubmit);
    listSearchForm.addEventListener('submit', onlistSearchFormSubmit);
    listSearch.addEventListener('click', getFullSearch);

  },

  // redraw: onListCardBodyClick,

  stop() {
    searchMarkup.cleanContainer();
    // listSearchBtn.removeEventListener('click', getSearch);
  }
};
