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

const listKeywordsHeader = document.querySelector('#list-keywords-header');
const listKeywordsBody = document.querySelector('#list-keywords-body');
const listKeywordsCard = document.querySelector('#list-keywords-card');
const listKeywordsCardEdit = document.querySelector('#list-keywords-card-edit');
const listKeywordsLinks = document.querySelector('#list-keywords-links');

// /////////////////////////////////
import search from './universal-search.js';
/*
const cardResources = document.querySelector('#card-resources');
const cardResourcesReturnBtn = document.querySelector('#card-resources-return-btn');
const cardResourcesDeleteBtn = document.querySelector('#card-resources-delete-btn');
const cardName = document.querySelector('#card-resources-name');

const cardResourcesResources = document.querySelector('#card-resources-body-resources');
const cardResourcesProduct = document.querySelector('#card-resources-body-product');

const cardResourcesOldCost = document.querySelector('#card-resources-old-cost');
const cardResourcesNewPrice = document.querySelector('#card-resources-new-price');

const resourcesAddBtn = document.querySelector('#resources-add-btn');
const productAddBtn = document.querySelector('#product-add-btn');
*/
import goodsList from './universal-goods-list.js';

const cardResourcesGroupModal = document.querySelector('#card-resources-group');
const cardResourcesGroupModalTitle = document.querySelector('#card-resources-title');
const cardResourcesGroupModalBody = document.querySelector('#card-resources-groups-body');
const cardResourcesGroupModalReturnBtn = document.querySelector('#card-resources-modal-return-btn');

const addResourcesModal = document.querySelector('#add-resources-modal');
// const addResourcesModalLabel = document.querySelector('#add-resources-modal-label');

import groupsList from './universal-groups-list.js';

let loadedGoods = [];
let loadedGroups = [];

let fastEditFlag = false;

// поиск по товару внутри группы
const cardResourcesSearchInput = document.querySelector('#card-resources-search-input');

const onSuccessAddLink = (answer) => {
  console.log(answer);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}/compare_meta`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: showKeywordLinks,
  };
};

const onGoodClick = (good) => {
  // $(cardResourcesGroupModal).modal('hide');
  // $(addResourcesModal).modal('show');
  // addResourcesModalLabel.innerHTML = good.name;
  // resourceAdd.start(addResourcesModal);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}/compare_meta`,
    data: `good=${auth.currentGoodId}&token=${auth.data.token}`,
    callbackSuccess: onSuccessAddLink,
  };
};

const drawGoods = (data) => {
  cardResourcesGroupModalReturnBtn.classList.remove('invisible');
  cardResourcesSearchInput.addEventListener('input', onGoodsSearch);
  cardResourcesSearchInput.removeEventListener('input', onGroupsSearch);
  goodsList.draw(data, cardResourcesGroupModalBody, onGoodClick, 'search');
};

const onGroupClick = () => {

  cardResourcesSearchInput.focus();
  cardResourcesSearchInput.value = '';

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods_light`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupGood,
  };
};

const drawGroups = (groupsData) => {
  console.log(groupsData);
  cardResourcesGroupModalReturnBtn.classList.add('invisible');
  cardResourcesSearchInput.removeEventListener('input', onGoodsSearch);
  cardResourcesSearchInput.addEventListener('input', onGroupsSearch);
  groupsList.draw(groupsData, cardResourcesGroupModalBody, onGroupClick);
};

const onGoodsSearch = (evt) => {
  drawGoods(search.make(loadedGoods.data, cardResourcesSearchInput.value));
};

const onGroupsSearch = (evt) => {
  drawGroups(search.make(loadedGroups.data, cardResourcesSearchInput.value));
};

const onSuccessGroupGood = (goodsData) => {
  loadedGoods = goodsData;
  cardResourcesGroupModalTitle.innerHTML = `Выберите товар в группе "${auth.currentGroupName}"`;
  cardResourcesGroupModalReturnBtn.addEventListener('click', getGroups);
  drawGoods(goodsData.data);
};

$(addResourcesModal).on('hidden.bs.modal', function () {
  if (fastEditFlag === false) {
    $(cardResourcesGroupModal).modal('show');
  }
});

const onSuccessGroupsLoad = (groupsData) => {
  loadedGroups = groupsData;
  cardResourcesGroupModalBody.innerHTML = '';
  cardResourcesGroupModalTitle.innerHTML = 'Выберите группу';
  cardResourcesSearchInput.focus();
  drawGroups(groupsData.data);
};

const getGroups = () => {
  auth.currentGroupId = false;
  cardResourcesSearchInput.value = '';
  $(cardResourcesGroupModal).modal('show');
  fastEditFlag = false;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupsLoad,
  };
};


const onResourcesAddBtn = () => {
  auth.currentCardOperation = -1;
  getGroups();
};


// ///////////////////////////////////////

const getKeywordsLinkString = (index, id, name) => {

  return `
      <div class="catalog-groups-header">
        <div class="catalog-groups-column">${index + 1}</div>
        <div class="catalog-groups-column">${name}</div>
        <div class="catalog-groups-column">
          <button id="add-keyword-link-btn" type="button" class="btn btn-success p-0 icon-btn icon-btn__unlink"></button>
        </div>
      </div>`;
};

const onDeleteLink = (answer) => {
  console.log(answer);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}/compare_meta`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: showKeywordLinks,
  };
};

const showKeywordLinks = (data) => {
  console.log(data);

  listKeywordsLinks.innerHTML = '';
  listKeywordsLinks.insertAdjacentHTML('afterbegin', `
    <div class="catalog-header">
      <h6>Товары, к которым привязано ключевое слово</h6>
      <button id="add-keyword-link-btn" type="button" class="btn btn-success p-0 icon-btn icon-btn__add"></button>
    </div>
    <div class="catalog-groups-header" style="background-color: #94E0DD;   font-weight: 700;">
      <div class="catalog-groups-column">№</div>
      <div class="catalog-groups-column">Название</div>
      <div class="catalog-groups-column"></div>
    </div>
  `);

  listKeywordsLinks.querySelector('#add-keyword-link-btn').addEventListener('click', onResourcesAddBtn);

  data.data.forEach((link, index) => {
    listKeywordsLinks.insertAdjacentHTML('beforeend', getKeywordsLinkString(index, link.id, link.name));
    console.log(listKeywordsCardEdit);
    console.log(listKeywordsCardEdit.lastChild);
    listKeywordsLinks.lastChild.lastElementChild.addEventListener('click', () => {
      xhr.request = {
        metod: 'DELETE',
        url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}/compare_meta`,
        data: `good=${link.id}&token=${auth.data.token}`,
        callbackSuccess: onDeleteLink,
      };
    });
  });
};

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
  listKeywordsLinks.innerHTML = '';
  auth.currentKeywordId = clickedKeywordNode.dataset.keywordId;
  auth.currentKeywordName = clickedKeywordNode.innerText.slice(1);
  auth.currentKeywordRgb = clickedKeywordNode.dataset.keywordRgb;
  hideReferenceKeywordsMain();
  showEditKeywordCard();

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${auth.currentKeywordId}/compare_meta`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: showKeywordLinks,
  };
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
