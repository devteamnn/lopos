import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import cardsMarkup from '../markup/catalog-cards.js';
import groupsMarkup from '../markup/catalog-groups.js';
import toolsMarkup from '../markup/tools.js';

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

const addResourcesModal = document.querySelector('#add-resources-modal');
const addResourcesModalLabel = document.querySelector('#add-resources-modal-label');


const onSuccessGroupGood = (goodsData) => {
  console.log(goodsData);
  cardResourcesGroupModalTitle.innerHTML = `Выберите товар в группе "${auth.currentGroupName}"`;
  cardResourcesGroupModalBody.innerHTML = `
    <div class="catalog-header-title">
      <button id="group-goods-return-btn" type="button" class="btn btn-success p-0 icon-btn icon-btn__return"></button>
        <h2 id="group-name"></h2>
      </div>`;
  cardResourcesGroupModalBody.lastChild.addEventListener('click', getGroups);

  goodsData.data.forEach((item, index) => {
    cardResourcesGroupModalBody.insertAdjacentHTML('beforeend', groupsMarkup.getGoodString(item, index));

    cardResourcesGroupModalBody.lastChild.addEventListener('click', (evt) => {
      console.log(evt);

      let currentStringElement = evt.target;
      while (!currentStringElement.dataset.goodId) {
        currentStringElement = currentStringElement.parentNode;
      }

      $(cardResourcesGroupModal).modal('hide');
      $(addResourcesModal).modal('show');
      addResourcesModalLabel.innerHTML = item.name;
      // groupName.innerHTML = currentGroupName;

      auth.currentGoodId = currentStringElement.dataset.goodId;
      // auth.currentGroupName = currentGroupName;

    });

  });

};

$(addResourcesModal).on('hidden.bs.modal', function () {
  $(cardResourcesGroupModal).modal('show');
});

const onSuccessGroupsLoad = (loadedGroups) => {

  cardResourcesGroupModalBody.innerHTML = '';
  cardResourcesGroupModalTitle.innerHTML = 'Выберите группу';
  loadedGroups.data.forEach((item, index) => {
    cardResourcesGroupModalBody.insertAdjacentHTML('beforeend', groupsMarkup.getElement(item, index));
    cardResourcesGroupModalBody.lastChild.addEventListener('click', (evt) => {

      let currentStringElement = evt.target;
      while (!currentStringElement.dataset.groupId) {
        currentStringElement = currentStringElement.parentNode;
      }

      let currentGroupName = loadedGroups.data[currentStringElement.dataset.groupIndex].name;
      // groupName.innerHTML = currentGroupName;

      auth.currentGroupId = currentStringElement.dataset.groupId;
      auth.currentGroupName = currentGroupName;

      xhr.request = {
        metod: 'POST',
        url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods_light`,
        data: `view_last=0&token=${auth.data.token}`,
        callbackSuccess: onSuccessGroupGood,
      };
    });
  });
  // cardResourcesGroupModalBody.insertAdjacentHTML('beforeend', loadedGroups.data.forEach((item, index) => groupsMarkup.getElement(item, index)));
};

const getGroups = () => {
  // groupsMarkup.cleanContainer();
  // groupsMarkup.drawMarkupInContainer(loaderSpinnerMarkup);
  auth.currentGroupId = false;
  $(cardResourcesGroupModal).modal('show');


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

  if (evt) {

    cardResources.classList.remove('d-none');
    listCardsCard.classList.add('d-none');

    let currentStringElement = evt.target;
    while (!currentStringElement.dataset.cardId) {
      currentStringElement = currentStringElement.parentNode;
    }


    let currentCardName = cardData.data[currentStringElement.dataset.cardIndex].name;
    cardName.innerHTML = currentCardName;
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

const setRequestToAddCard = (name) => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card`,
    data: `name=${name}&token=${auth.data.token}`,
    callbackSuccess: getCards,
  };
};

const setupUniversalAdd = () => {
  toolsMarkup.runUniversalAdd = {
    title: 'Создание карточки (БЕЗ ВАЛИДАЦИИ)',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    submitBtnName: 'Создать',
    submitCallback: setRequestToAddCard
  };
};

const setRequestToAddEditCard = (name) => {
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/nomenclature_card/${auth.currentCardId}`,
    data: `name=${name}&token=${auth.data.token}`,
    callbackSuccess: () => {
      cardName.innerHTML = name;
      auth.currentCardName = name;
    },
  };
};

const setupUniversalAddEdit = () => {
  toolsMarkup.runUniversalAdd = {
    title: 'Редактирование карточки (БЕЗ ВАЛИДАЦИИ)',
    inputLabel: 'Название',
    inputPlaceholder: 'введите название',
    inputValue: auth.currentCardName,
    submitBtnName: 'Изменить',
    submitCallback: setRequestToAddEditCard
  };
};

listCardAddBtn.addEventListener('click', setupUniversalAdd);
listCardEditBtn.addEventListener('click', setupUniversalAddEdit);

export default {

  start() {
    listCards.addEventListener('click', getCards);
  },

  redraw: onListCardBodyClick,

  stop() {
    cardsMarkup.cleanContainer();
    listCards.removeEventListener('click', getCards);
  }
};
