import logMarkup from '../markup/log.js';
import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';

const listLog = document.querySelector('#list-log-list');
const listLogBody = document.querySelector('#log-body');
const loader = document.querySelector('#loader');
const loaderWait = document.querySelector('#loader-wait');
const loaderFinish = document.querySelector('#loader-finish');
const loaderFail = document.querySelector('#loader-fail');

// начальная позиция и смещение
let logCardNodes = [];
let position = 0;
const count = 200;
const drawSet = count / 4;


// отрисовка порции карточек
const drawCardSet = () => logCardNodes.splice(0, drawSet).forEach(logMarkup.addCardToContainer);

// создание нод по полученной порции данных
const createCardNodes = (cardData) => cardData.forEach((item, index) => logCardNodes.push(logMarkup.getElement(item, index)));

// успех загрузки
const onSuccessLogLoad = (logResponse) => {
  let loadedLog = logResponse.data;

  loaderWait.classList.add('d-none');
  if (loadedLog.length) {
    createCardNodes(loadedLog);
  } else {
    loaderFinish.classList.remove('d-none');
    window.removeEventListener('scroll', onMouseScroll);
    return;
  }
  if (position === 0) {
    drawCardSet();
  }
  window.addEventListener('scroll', onMouseScroll);
};

// ошибка загрузки
const onErrorLogLoad = () => {
  loaderFail.classList.remove('d-none');
  loader.classList.add('d-none');
  loaderWait.classList.add('d-none');
  loaderFinish.classList.add('d-none');
};

// отправка запроса на новую порцию
const getLog = () => {
  console.log('get.log');
  if (logCardNodes.length === 0) {
    loaderWait.classList.remove('d-none');
    window.removeEventListener('scroll', onMouseScroll);
    xhr.request = {
      metod: 'POST',
      url: `lopos_directory/${auth.data.directory}/update_log/${Date.now()}/story`,
      data: `position=${position}&count=${count}&token=${auth.data.token}`,
      callbackSuccess: onSuccessLogLoad,
      callbackError: onErrorLogLoad
    };
  }
};

// "ленивая отрисовка" журнала
const isBottomReached = () => listLogBody.getBoundingClientRect().bottom - window.innerHeight <= 150;

const onMouseScroll = (evt) => {

  if (isBottomReached() && logCardNodes.length > 0) {
    loader.classList.remove('d-none');
    window.removeEventListener('scroll', onMouseScroll);

    window.setTimeout(function () {
      window.addEventListener('scroll', onMouseScroll);
      loader.classList.add('d-none');
      drawCardSet();
    }, 500);


  } else if (logCardNodes.length === 0) {
    position += count;
    getLog();
  }

};

export default {

  start() {
    listLog.addEventListener('click', getLog);
  },

  stop() {
    logMarkup.cleanContainer();
    logCardNodes = [];
    position = 0;

    loaderFail.classList.add('d-none');
    loader.classList.add('d-none');
    loaderWait.classList.add('d-none');
    loaderFinish.classList.add('d-none');

    listLog.removeEventListener('click', getLog);
    window.removeEventListener('scroll', onMouseScroll);
  }
};
