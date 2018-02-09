import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import groups from './catalog__groups.js';
import goods from './catalog__goods.js';
import keywordsUniversal from './universal-keywords.js';
import goodsList from './universal-goods-list.js';
import validity from './../tools/single-validation.js';

import searchBarcode from './catalog__search-barcode.js';

const listSearch = document.querySelector('#list-search-list');
const listSearchBody = document.querySelector('#list-search-card-body');
const listSearchBtn = document.querySelector('#list-search-btn');
const listSearchForm = document.querySelector('#list-search-form');
const listSearchInput = document.querySelector('#list-search-input');

const listSearchKeywordsChecked = document.querySelector('#list-search-card-body-checked-keywords');
const listSearchKeywordsBtn = document.querySelector('#list-search-keywords-btn');
const listSearchKeywordsModal = document.querySelector('#search-card-keywords');
const listSearchKeywordsModalBody = document.querySelector('#search-card-keywords-body');
const listSearchKeywordsResetBtn = document.querySelector('#list-search-card-reset-btn');
const listSearchKeywordsModalSubmit = document.querySelector('#search-card-keywords-submit');

const loaderSpinnerId = 'loader-cards';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

// отрисовка карточки товара
listSearchBody.addEventListener('click', groups.openGoodCard);

// массив с полными результатами
let fullSearch = [];
let keywordSearch = [];

const onGoodClick = () => {
  goods.fill();
};

// отрисовка результатов поиска
const drawResult = (data) => {
  if (data.length) {
    goodsList.draw(data, listSearchBody, onGoodClick, 'string');
  } else {
    listSearchBody.innerHTML = `Не завезли пока <b>${listSearchInput.value}</b>, хотя и ждали намедни...`;
  }
};

const makeSearch = () => {
  // ЗДЕСЬ СНИМАЕМ (здесь отрисованы результаты поиска, т.е. он прошел успешно)
  let selectedData = [];
  fullSearch.data.forEach((item) => {
    if (item.name.toLowerCase().indexOf(listSearchInput.value.toLowerCase()) !== -1) {
      selectedData.push(item);
    }
  });
  drawResult(selectedData);
};

// поиск по массиву результатов fullSearch
const onlistSearchFormSubmit = (evt) => {
  evt.preventDefault();
  listSearchBody.innerHTML = '';
  if (listSearchInput.value) {
    if (validity.valid(listSearchInput)) {
      makeSearch();
    }
  } else if (selectedKeywords === '') {
    drawResult(keywordSearch.data);
  } else {
    listSearchBody.innerHTML = 'Ну скажите хоть что-нибудь...';
  }
};

const onSuccessFullSearchLoad = (fullSearchLoad) => {
  fullSearch = fullSearchLoad;
  document.querySelector(`#${loaderSpinnerId}`).remove();
  if (fullSearchLoad.status === 271) {
    listSearchBody.innerHTML = fullSearchLoad.message;
  }
  listSearchBody.innerHTML = '';
};

const getFullSearch = () => {
  listSearchKeywordsChecked.innerHTML = '';
  listSearchBody.innerHTML = loaderSpinnerMarkup;
  selectedKeywords = [];

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_full_list`,
    data: `token=${auth.data.token}&name=${listSearchInput.value}`,
    callbackSuccess: onSuccessFullSearchLoad,
  };
};

// поиск по ключевым словам
const onSuccessKeywordSearch = (keywordSearchData) => {
  console.log(keywordSearchData);
  if (keywordSearchData.status === 271) {
    listSearchBody.innerHTML = 'Ключевые слова: ' + keywordSearchData.message;
    getFullSearch();
    listSearchInput.value = '';
  } else {
    keywordSearch = keywordSearchData;
    auth.searchMode = 'keywords';
    listSearchBody.innerHTML = '';
    drawResult(keywordSearchData.data);
    fullSearch = keywordSearchData;
    listSearchInput.value = '';
  }
};

let selectedKeywords = [];

const onListSearchKeywordsModalSubmit = () => {
  listSearchBody.innerHTML = loaderSpinnerMarkup;
  let selectedKeywordsNodes = listSearchKeywordsModalBody.querySelectorAll('.keyword:not(.keyword__mute)');
  selectedKeywords = [];
  if (selectedKeywordsNodes.length) {
    listSearchKeywordsChecked.innerHTML = 'Поиск идет по данным ключевым словам: ';
    selectedKeywordsNodes.forEach((keywordNode) => {
      selectedKeywords.push(keywordNode.dataset.keywordId);
      listSearchKeywordsChecked.appendChild(keywordNode.cloneNode(true)).classList.add('keyword__small');
    });
    xhr.request = {
      metod: 'POST',
      url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good_search`,
      data: `token=${auth.data.token}&tags=[${selectedKeywords}]`,
      callbackSuccess: onSuccessKeywordSearch,
    };
  } else {
    auth.searchMode = 'base';
  }
};

listSearchKeywordsModalSubmit.addEventListener('click', onListSearchKeywordsModalSubmit);

// обработчик клика по ключевому слову
const onKeywordClick = (evt) => evt.target.classList.toggle('keyword__mute');

// установка прозрачности
const keywordModificator = (keywordId, keywordNode) => {
  if (selectedKeywords.every((tagItem) => (tagItem !== keywordId))) {
    keywordNode.classList.add('keyword__mute');
  }
};

// запускаем выбор ключевых слов
const onListSearchKeywordsBtn = () => {
  keywordsUniversal.downloadAndDraw(listSearchKeywordsModalBody, onKeywordClick, keywordModificator);
  $(listSearchKeywordsModal).modal('show');
  listSearchKeywordsChecked.innerHTML = '';
  listSearchKeywordsResetBtn.removeAttribute('disabled');
};

// сброс ключевых слов
const onListSearchKeywordsResetBtn = () => {
  listSearchInput.value = '';
  listSearchKeywordsChecked.innerHTML = '';
  keywordSearch = '';
  listSearchKeywordsResetBtn.setAttribute('disabled', 'disabled');
  getFullSearch();
};
listSearchKeywordsResetBtn.addEventListener('click', onListSearchKeywordsResetBtn);

// поиск по штрихкоду и ключевым словам
searchBarcode.start();
listSearchKeywordsBtn.addEventListener('click', onListSearchKeywordsBtn);

export default {

  start() {
    auth.searchMode = 'base';
    listSearchInput.focus();
    listSearchBtn.addEventListener('click', onlistSearchFormSubmit);
    listSearchForm.addEventListener('submit', onlistSearchFormSubmit);
    listSearch.addEventListener('click', getFullSearch);

  },

  drawResult,

  stop() {
    // listSearchBtn.removeEventListener('click', getSearch);
  }
};
