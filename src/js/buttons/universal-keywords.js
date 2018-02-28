import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';

// Вызываем спиннер
const loaderSpinnerId = 'loader-goods';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

// контейнер для отрисовки
let container = null;

// обработчик клика по клюслову
let keywordHandler = null;

// модификатор отображения при отрисовке ключевого слова
let keywordModificator = null;

// установка прозрачности
const setKeywordModificator = (keywordId, keywordNode) => {
  if (keywordModificator) {
    keywordModificator(keywordId, keywordNode);
  }
};


// УНИФИЦИРОВАННАЯ ОТРИСОВКА КЛЮЧЕВОГО СЛОВА
const getKeywordMarkup = (keyword) => `<h3 class="keyword" style="background-color: #${keyword.color};"; data-keyword-Id=${keyword.id} data-keyword-rgb=${keyword.color}>#${keyword.name}</h3>`;

// принимает необязательный параметр handler на тот случай, когда массив не загружается обычным способом (например, ключевые слова, ассоциированные с товаром)
const drawKeywordsToContainerExternalData = (containerToDraw, handler, keyword) => {
  containerToDraw.insertAdjacentHTML('beforeend', getKeywordMarkup(keyword));
  containerToDraw.lastChild.addEventListener('click', handler);
};

const drawKeywordsToContainer = (keyword) => {
  console.log(keyword);
  container.insertAdjacentHTML('beforeend', getKeywordMarkup(keyword));
  setKeywordModificator(keyword.id, container.lastChild);
  container.lastChild.addEventListener('click', keywordHandler);
};

// обработка успеха загрузки клюслов для ситуации с тегами товаров
const onSuccessKeywordsLoad = (loadedKeywords) => {

  document.querySelector(`#${loaderSpinnerId}`).remove();

  if (loadedKeywords.status === 200 && loadedKeywords.data) {
    loadedKeywords.data.forEach((keyword) => drawKeywordsToContainer(keyword));
  } else if (loadedKeywords.status === 200 && !loadedKeywords.data) {
    container.innerHTML = `<p>${loadedKeywords.message || 'Что-то в поле message пусто и в data лежит false'}</p>`;
  }
};

const getKeywords = (containerToDraw, handler, modificator) => {

  container = containerToDraw;
  keywordHandler = handler;
  keywordModificator = modificator;
  container.innerHTML = loaderSpinnerMarkup;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessKeywordsLoad,
  };
};

export default {
  downloadAndDraw: getKeywords,
  getDataAndDraw: drawKeywordsToContainerExternalData,
};
