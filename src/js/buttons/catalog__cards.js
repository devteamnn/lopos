import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import cardsMarkup from '../markup/catalog-cards.js';
import toolsMarkup from '../markup/tools.js';
import cardAdd from './catalog__cards--add-edit.js';
import resourceAdd from './catalog__cards--add-resource.js';
import goodsList from './universal-goods-list.js';
import search from './universal-search.js';
import groupsList from './universal-groups-list.js';

const listCards = document.querySelector('#list-cards-list');
const listCardsCard = document.querySelector('#list-cards-card');
const listCardBody = document.querySelector('#list-cards-card-body');
const listCardAddBtn = document.querySelector('#list-cards-card-add-btn');
const listCardEditBtn = document.querySelector('#card-resources-edit-btn');
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
const cardResourcesGroupModal = document.querySelector('#card-resources-group');
const cardResourcesGroupModalTitle = document.querySelector('#card-resources-title');
const cardResourcesGroupModalBody = document.querySelector('#card-resources-groups-body');
const cardResourcesGroupModalReturnBtn = document.querySelector('#card-resources-modal-return-btn');

const addResourcesModal = document.querySelector('#add-resources-modal');
const addResourcesModalLabel = document.querySelector('#add-resources-modal-label');

const universalAdd = document.querySelector('#universal-add');

let loadedGoods = [];
let loadedGroups = [];

let fastEditFlag = false;

// поиск по товару внутри группы
const cardResourcesSearchInput = document.querySelector('#card-resources-search-input');

const onGoodClick = (good) => {
  $(cardResourcesGroupModal).modal('hide');
  $(addResourcesModal).modal('show');
  addResourcesModalLabel.innerHTML = good.name;
  resourceAdd.start(addResourcesModal);
};

const drawGoods = (data) => {


  cardResourcesGroupModalReturnBtn.classList.remove('invisible');
  cardResourcesSearchInput.addEventListener('input', onGoodsSearch);
  cardResourcesSearchInput.removeEventListener('input', onGroupsSearch);
  goodsList.draw(data, cardResourcesGroupModalBody, onGoodClick, 'string');
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

const onProductAddBtn = () => {
  auth.currentCardOperation = 1;
  getGroups();
};


resourcesAddBtn.addEventListener('click', onResourcesAddBtn);
productAddBtn.addEventListener('click', onProductAddBtn);

const loaderSpinnerId = 'loader-cards';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

let cardData = [];

const onSuccessCardResourcesLoad = (cardResourcesData) => {
  console.log(cardResourcesData);
  cardResourcesResources.innerHTML = '';
  cardResourcesProduct.innerHTML = '';
  cardResourcesOldCost.innerHTML = (+cardResourcesData.data.old_cost) ? cardResourcesData.data.old_cost : '';
  cardResourcesNewPrice.innerHTML = (+cardResourcesData.data.new_price) ? cardResourcesData.data.new_price : '';
  cardName.innerHTML = cardResourcesData.data.name;

  if (cardResourcesData.data.resours.length) {
    cardResourcesData.data.resours.forEach((item) => {

      const onResourcesGoodClick = (good) => {
        $(cardResourcesGroupModal).modal('hide');
        $(addResourcesModal).modal('show');
        addResourcesModalLabel.innerHTML = item.name;
        auth.currentGoodId = item.good_id;
        auth.currentCardOperation = (item.value < 0) ? -1 : 1;
        resourceAdd.start(addResourcesModal);
        fastEditFlag = true;
      };

      if (item.value < 0) {
        cardResourcesResources.insertAdjacentHTML('beforeend', cardsMarkup.getResourceElement(item));
        cardResourcesResources.lastChild.addEventListener('click', onResourcesGoodClick);
      } else {
        cardResourcesProduct.insertAdjacentHTML('beforeend', cardsMarkup.getResourceElement(item));
        cardResourcesProduct.lastChild.addEventListener('click', onResourcesGoodClick);
      }
    });
  } else {
    cardResourcesResources.innerHTML = 'Nothig left, but hope';
    cardResourcesProduct.innerHTML = 'Nothig left, but hope';
  }
};

const onCardResourcesReturnBtn = () => {
  cardResources.classList.add('d-none');
  listCardsCard.classList.remove('d-none');
  getCards();
};

cardResourcesReturnBtn.addEventListener('click', onCardResourcesReturnBtn);

const onListCardBodyClick = (evt) => {
  console.log(evt);
  console.log('onListCardBodyClick');
  if (evt) {

    cardResources.classList.remove('d-none');
    listCardsCard.classList.add('d-none');

    let currentStringElement = evt.target;
    while (!currentStringElement.dataset.cardId) {
      currentStringElement = currentStringElement.parentNode;
    }

    let currentCardName = cardData.data[currentStringElement.dataset.cardIndex].name;
    // cardName.innerHTML = currentCardName;
    auth.currentCardName = currentCardName;
    auth.currentCardId = currentStringElement.dataset.cardId;
  }

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card/${auth.currentCardId}/card_info`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessCardResourcesLoad,
  };

};

listCardBody.addEventListener('click', onListCardBodyClick);

const onSuccessCardsLoad = (loadedCards) => {
  document.querySelector(`#${loaderSpinnerId}`).remove();
  console.log(loadedCards);
  cardData = loadedCards;
  cardsMarkup.drawDataInContainer(loadedCards.data);

};

const getCards = () => {
  listCardBody.innerHTML = loaderSpinnerMarkup;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessCardsLoad,
  };
};

const onSuccessCardResourcesDelete = (answer) => {
  console.log(answer);

  onCardResourcesReturnBtn();

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message: `Карточка <b>${auth.currentCardName}</b> успешно удалена`
  };

};

const setRequestToDeleteCardResources = (evt) => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card/${auth.currentCardId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessCardResourcesDelete,
  };
};

const onCardResourcesDeleteBtnClick = (evt) => {

  toolsMarkup.actionRequestModal = {
    title: 'Удаление',
    message: `Вы точно хотите удалить карточку <b>${auth.currentCardName}</b>?`,
    submitCallback: setRequestToDeleteCardResources
  };

};

cardResourcesDeleteBtn.addEventListener('click', onCardResourcesDeleteBtnClick);

const setupUniversalAdd = () => {
  auth.currentCardName = '';
  toolsMarkup.runUniversalAdd = {
    title: 'Создание карточки',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    submitBtnName: 'Создать',
  };
  cardAdd.start(universalAdd);
};

const setupUniversalAddEdit = () => {
  toolsMarkup.runUniversalAdd = {
    title: 'Редактирование карточки',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    inputValue: auth.currentCardName,
    submitBtnName: 'Изменить',
  };
  cardAdd.start(universalAdd);
};

listCardAddBtn.addEventListener('click', setupUniversalAdd);
listCardEditBtn.addEventListener('click', setupUniversalAddEdit);

export default {

  start() {
    listCards.addEventListener('click', getCards);
  },

  redrawList: getCards,
  redrawCard: onListCardBodyClick,

  stop() {
    listCards.removeEventListener('click', getCards);
  }
};
