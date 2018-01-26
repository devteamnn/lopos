import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import cardsMarkup from '../markup/catalog-cards.js';
import toolsMarkup from '../markup/tools.js';

const listCards = document.querySelector('#list-cards-list');
const listCardsCard = document.querySelector('#list-cards-card');
const listCardBody = document.querySelector('#list-cards-card-body');
const cardResources = document.querySelector('#card-resources');
const cardResourcesReturnBtn = document.querySelector('#card-resources-return-btn');
const cardName = document.querySelector('#card-resources-name');

const cardResourcesResources = document.querySelector('#card-resources-body-resources');
const cardResourcesProduct = document.querySelector('#card-resources-body-product');

const cardResourcesOldCost = document.querySelector('#card-resources-old-cost');
const cardResourcesNewPrice = document.querySelector('#card-resources-new-price');

const resourcesAddBtn = document.querySelector('#resources-add-btn');
const productAddBtn = document.querySelector('#product-add-btn');

const onResourcesAddBtn = () => {

};

const onProductAddBtn = () => {

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
  if (cardResourcesData.data.resours.length) {
    cardResourcesData.data.resours.forEach((item) => {
      if (item.value < 0) {
        cardResourcesResources.insertAdjacentHTML('beforeend', cardsMarkup.getResourceElement(item));
      } else {
        cardResourcesProduct.insertAdjacentHTML('beforeend', cardsMarkup.getResourceElement(item));
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
  cardResources.classList.remove('d-none');
  listCardsCard.classList.add('d-none');

  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.cardId) {
    currentStringElement = currentStringElement.parentNode;
  }


  let currentCardName = cardData.data[currentStringElement.dataset.cardIndex].name;
  cardName.innerHTML = currentCardName;
  auth.currentCardId = currentStringElement.dataset.cardId;
  auth.currentCardName = currentCardName;

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

export default {

  start() {
    listCards.addEventListener('click', getCards);
  },

  redraw: getCards,

  stop() {
    cardsMarkup.cleanContainer();
    listCards.removeEventListener('click', getCards);
  }
};
