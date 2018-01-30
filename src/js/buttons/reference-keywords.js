import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import keywordsUniversal from './universal-keywords.js';

const listKeywords = document.querySelector('#list-keywords-list');
const listKeywordsReturnBtn = document.querySelector('#list-keywords-card-return-btn');
const listKeywordsCardEditRGBForm = document.querySelector('#keywords-card-edit-rgb-form');
const listKeywordsCardDeleteBtn = document.querySelector('#list-keywords-card-delete-btn');
const listKeywordsCardEditBtn = document.querySelector('#list-keywords-card-edit-btn');
const listKeywordsCardEditName = document.querySelector('#keywords-card-edit-name');

// здесь был дубль в модуле с разметкой
const listKeywordsHeader = document.querySelector('#list-keywords-header');
const listKeywordsBody = document.querySelector('#list-keywords-body');
const listKeywordsCard = document.querySelector('#list-keywords-card');
const listKeywordsCardEdit = document.querySelector('#list-keywords-card-edit');

// функция прячет страницу "справочники -> ключевые слова"
const hideReferenceKeywordsMain = () => {
  listKeywordsHeader.classList.add('d-none');
  listKeywordsHeader.classList.remove('d-flex');
  listKeywordsBody.classList.add('d-none');
};
// функция показывает страницу "справочники -> ключевые слова"
const showReferenceKeywordsMain = () => {
  listKeywordsHeader.classList.remove('d-none');
  listKeywordsHeader.classList.add('d-flex');
  listKeywordsBody.classList.remove('d-none');
};

// функция показывает карточку редактирования ключевого слова
const showEditKeywordCard = () => {
  listKeywordsCardEdit.innerHTML = '';
  listKeywordsCard.classList.remove('d-none');
  keywordsUniversal.getDataAndDraw(listKeywordsCardEdit, null, {color: auth.currentKeywordRgb, name: auth.currentKeywordName});
};

// обработчик
const onKeywordClick = (evt) => {
  let clickedKeywordNode = evt.target;
  auth.currentKeywordId = clickedKeywordNode.dataset.keywordId;
  auth.currentKeywordName = clickedKeywordNode.innerText.slice(1);
  auth.currentKeywordRgb = clickedKeywordNode.dataset.keywordRgb;
  hideReferenceKeywordsMain();
  showEditKeywordCard();
};

// ================== удаление ключевго слова ============================
const onSuccessKeywordDelete = () => {
  getKeywords();
  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: `Ключевое слово <b>${auth.currentKeywordName}</b> успешно удалено`
  };
};

const setRequestToDeleteKeyword = () => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessKeywordDelete,
  };
};

listKeywordsCardDeleteBtn.addEventListener('click', function () {
  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить ключевое слово <b>${auth.currentKeywordName}</b>?`,
    submitCallback: setRequestToDeleteKeyword
  };
});


// ================== редактирование ключевго слова ============================
listKeywordsCardEditBtn.addEventListener('click', function () {
  listKeywordsCardEditName.value = auth.currentKeywordName;
});

const onListKeywordsCardEditRGBFormSubmit = (evt) => {
  evt.preventDefault();
  let newRGB = listKeywordsCardEditRGBForm.querySelector('input:checked').value;
  auth.currentKeywordRgb = newRGB;
  document.querySelector('#list-keywords-card-edit > h3').style.backgroundColor = '#' + auth.currentKeywordRgb;
  $('#keywords-card-edit-rgb').modal('hide');

  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}`,
    data: `color=${auth.currentKeywordRgb}&token=${auth.data.token}`,
    callbackSuccess: showEditKeywordCard,
  };

};

listKeywordsCardEditRGBForm.addEventListener('submit', onListKeywordsCardEditRGBFormSubmit);
listKeywordsReturnBtn.addEventListener('click', getKeywords);


const getKeywords = () => {
  keywordsUniversal.downloadAndDraw(listKeywordsBody, onKeywordClick);
  showReferenceKeywordsMain();

  listKeywordsCard.classList.add('d-none');
  listKeywordsReturnBtn.addEventListener('click', getKeywords);
};

// функция для перехода из других модулей, меняет обработчик возврата
const showKeywordEdit = (evt, handler) => {
  onKeywordClick(evt);
  listKeywordsReturnBtn.removeEventListener('click', getKeywords);
  listKeywordsReturnBtn.addEventListener('click', handler);
};

export default {

  start() {
    listKeywords.addEventListener('click', getKeywords);
  },

  redraw: showEditKeywordCard,
  update: getKeywords,
  showKeywordEdit,

  stop() {
    listKeywordsBody.innerHTML = '';
    listKeywords.removeEventListener('click', getKeywords);
  }
};
