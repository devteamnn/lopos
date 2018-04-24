import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import cardsMarkup from '../markup/catalog-cards-manufacture.js';
import cardsMarkupModal from '../markup/catalog-cards.js';
import quantityEditModal from './operations__manufacture--edit-quantity.js';

const manufactureList = document.querySelector('#list-manufacture-list');
const manufactureStocks = document.querySelector('#manufacture-stocks');
const manufactureAddBtn = document.querySelector('#list-manufacture-card-add-btn');
const manufactureCountBtn = document.querySelector('#list-manufacture-count');
const manufactureMaterialCheck = document.querySelector('#manufacture-material-check');
const manufactureMakeBtn = document.querySelector('#list-manufacture-make');
const manufactureColumnBody = document.querySelector('#manufacture-card-manufacture');
const materialColumnBody = document.querySelector('#manufacture-card-material');
const goodColumnBody = document.querySelector('#manufacture-card-good');

const nomenklatureCardModal = document.querySelector('#select-nomenklature-card');
const nomenklatureCardModalBody = document.querySelector('#select-nomenklature-card-body');

const manufactureAmountModal = document.querySelector('#manufacture-amount-edit');

let loadedNomenklatureCards = '';
let selectedNomenklatureCards = '';
let currentGoods = [];
let currentStringElement = '';

const delCard = (cards) => {
  let newRows = [];

  cards.forEach((el) => {
    if (!el.del) {
      newRows.push(el);
    }
  });

  return newRows.slice();
};

const drawCard = () => {
  manufactureColumnBody.innerHTML = '';
  cardsMarkup.drawDataInContainer(selectedNomenklatureCards, manufactureColumnBody);
  drawGoodsToColumns();
};
// #################### РАЗМЕТКА ДЛЯ ПОМЕЩЕНИЯ ТОВАРОВ В КОЛОНКИ ######################

const getMaterialString = (id, name, good, index, value, classDanger) => {

  return `
      <div class="manufacture-header ${classDanger}" data-good-id="${id}">
        <div class="manufacture-4-column">${index}</div>
        <div class="manufacture-4-column">${name}</div>
        <div class="manufacture-4-column ${(good) ? good : 'text-muted'}">${(good) ? good : 'x' }</div>
        <div class="manufacture-4-column">${value}</div>
      </div>`;
};

const getGoodString = (id, name, good, index, value, classDanger) => {

  return `
      <div class="manufacture-header ${classDanger}" data-good-id="${id}">
        <div class="manufacture-3-column">${index}</div>
        <div class="manufacture-3-column">${name}</div>
        <div class="manufacture-3-column">${value}</div>
      </div>`;
};

const drawGoodsToColumns = () => {
  let materialNumber = 0;
  let goodNumber = 0;
  materialColumnBody.innerHTML = '';
  goodColumnBody.innerHTML = '';
  manufactureCountBtn.removeAttribute('disabled');
  currentGoods = [];
  materialColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-4-column">№</div>
        <div class="manufacture-4-column">Товар</div>
        <div class="manufacture-4-column">Нал</div>
        <div class="manufacture-4-column style="margin-right:3px;">Кол-во</div>
      </div>
    `;

  goodColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-3-column">№</div>
        <div class="manufacture-3-column">Товар</div>
        <div class="manufacture-3-column style="margin-right:3px;">Кол-во</div>
      </div>
    `;
  selectedNomenklatureCards.forEach((card) => {
    if (card.content) {
      card.content.forEach((good) => {
        currentGoods.push(good);
        if (good.value < 0) {
          materialNumber++;
          materialColumnBody.insertAdjacentHTML('beforeend', getMaterialString(good.id, good.name, good.good, materialNumber, good.value * card.k, ''));
        } else {
          goodNumber++;
          goodColumnBody.insertAdjacentHTML('beforeend', getGoodString(good.id, good.name, '', goodNumber, good.value * card.k, ''));
        }
      });
    }
  });
};
// #################### КНОПКА ВЫПОЛНИТЬ ####################
const onManufactureMakeBtnClick = () => {
  let data = currentGoods.map((good) => [JSON.stringify({
    value: good.value,
    good: good.id,
    price: 0
  })]);
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/stock/${auth.currentStockId}/temp_naklad_provesti`,
    data: `content=[${data}]&token=${auth.data.token}&delivery=0&type=8&kontr_agent=2`,
    callbackSuccess: getManufacture,
  };
};

manufactureMakeBtn.addEventListener('click', onManufactureMakeBtnClick);
// #################### КНОПКА ПОДСЧЕТ ######################
const onSuccessCountLoad = (data) => {
  let materialNumber = 0;
  let goodNumber = 0;
  materialColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-4-column">№</div>
        <div class="manufacture-4-column">Товар</div>
        <div class="manufacture-4-column">Нал</div>
        <div class="manufacture-4-column">Кол</div>
      </div>
    `;

  goodColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-3-column">№</div>
        <div class="manufacture-3-column">Товар</div>
        <div class="manufacture-3-column">Кол</div>
      </div>
    `;
  for (let i = 0; i < data.data.length; i++) {
    if (currentGoods[i].value < 0) {
      materialNumber++;
      let classDanger = ((+data.data[i].value + +currentGoods[i].value) < 0) ? 'bg-danger' : '';
      materialColumnBody.insertAdjacentHTML('beforeend', getMaterialString(currentGoods[i].id, currentGoods[i].name, data.data[i].value, materialNumber, currentGoods[i].value, classDanger));
    } else {
      goodNumber++;
      goodColumnBody.insertAdjacentHTML('beforeend', getGoodString(currentGoods[i].id, currentGoods[i].name, data.data[i].value, goodNumber, currentGoods[i].value));
    }
  }
  if (materialColumnBody.querySelectorAll('.bg-danger').length === 0) {
    manufactureMaterialCheck.classList.remove('d-none');
    manufactureMakeBtn.removeAttribute('disabled');
  } else {
    manufactureMaterialCheck.classList.add('d-none');
    manufactureMakeBtn.setAttribute('disabled', 'disabled');
  }
};

const onManufactureCountBtnClick = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/stock/${auth.currentStockId}/some_goods/`,
    data: `content=[${currentGoods.map((good) => good.id)}]&token=${auth.data.token}`,
    callbackSuccess: onSuccessCountLoad,
  };
};
manufactureCountBtn.addEventListener('click', onManufactureCountBtnClick);

// #################### ОБРАБАТЫВАЕМ КЛИКИ ПО СПИСКУ В ПЕРВОЙ КОЛОНКЕ ######################

const submitCallback = (numCardCnt) => {

  if (numCardCnt === '0') {
    selectedNomenklatureCards.forEach((card) => {
      if (card.id === currentStringElement.dataset.cardId) {
        card.del = true;
        nomenklatureCardModalBody.querySelector(`*[data-card-id="${card.id}"]`).
          classList.remove('manufacture-nomenklature-card--muted');
      } else {
        card.del = false;
      }
    });

    selectedNomenklatureCards = delCard(selectedNomenklatureCards);

  } else {
    selectedNomenklatureCards.forEach((card) => {
      if (card.id === currentStringElement.dataset.cardId) {
        card.k = numCardCnt;
      }
    });
  }

  drawCard();
  manufactureMakeBtn.setAttribute('disabled', 'disabled');
  document.querySelector('#universal-modal-micro-valid').innerHTML = '';
  $('#universal-modal-micro').modal('hide');
};

const onManufactureColumnBodyClick = (evt) => {

  if (selectedNomenklatureCards.length !== 0) {
    currentStringElement = evt.target;

    while (!currentStringElement.dataset.cardId) {
      if (currentStringElement.parentNode) {
        currentStringElement = currentStringElement.parentNode;
      }
    }
    quantityEditModal.start(manufactureAmountModal, submitCallback);
  }
};

manufactureColumnBody.addEventListener('click', onManufactureColumnBodyClick);

// #################### ОБРАБАТЫВАЕМ КЛИКИ ПО СПИСКУ КАРТОЧКЕ В МОДАЛЬНОМ ОКНЕ #############
$(nomenklatureCardModal).on('hidden.bs.modal', () => {

  if (!selectedNomenklatureCards.length) {
    selectedNomenklatureCards = [].map.call(document.querySelectorAll('.manufacture-nomenklature-card--muted'), (item) => Object.assign(loadedNomenklatureCards[item.dataset.cardIndex], {
      k: 1
    }));

  } else {
    selectedNomenklatureCards.forEach((item) => {
      item.del = true;
    });
    let selectCards = document.querySelectorAll('.manufacture-nomenklature-card--muted');

    if (selectCards.length !== 0) {
      selectCards.forEach((item) => {
        let newCard = true;

        for (let i = 0; i < selectedNomenklatureCards.length; i++) {
          if (selectedNomenklatureCards[i].id === item.dataset['cardId']) {
            selectedNomenklatureCards[i].del = false;
            newCard = false;
            break;
          }
        }

        if (newCard) {
          selectedNomenklatureCards.push(Object.assign(loadedNomenklatureCards[item.dataset.cardIndex], {
            k: 1,
            del: false
          }));
        }
      });

      selectedNomenklatureCards = delCard(selectedNomenklatureCards);

    } else {
      selectedNomenklatureCards = [];
    }
  }

  drawCard();
  manufactureMaterialCheck.classList.add('d-none');
});

const onListCardBodyClick = (evt) => {
  currentStringElement = evt.target;
  while (!currentStringElement.dataset.cardId) {
    currentStringElement = currentStringElement.parentNode;
  }
  currentStringElement.classList.toggle('manufacture-nomenklature-card--muted');
};

nomenklatureCardModalBody.addEventListener('click', onListCardBodyClick);

// ############################## ЗАГРУЗКА И ОТРИСОВКА ДАННЫХ ##############################

manufactureAddBtn.addEventListener('click', () => $(nomenklatureCardModal).modal('show'));

manufactureStocks.addEventListener('change', (evt) => {
  auth.currentStockId = evt.target.value;
  manufactureMakeBtn.setAttribute('disabled', 'disabled');
});

const onSuccessManufactureLoad = (manufactureData) => {
  loadedNomenklatureCards = manufactureData.data.all_nomenclature_cards;
  nomenklatureCardModalBody.innerHTML = '';
  manufactureColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-3-column">№</div>
        <div class="manufacture-3-column">Товар</div>
        <div class="manufacture-3-column style="margin-right:3px;">Кол-во</div>
      </div>
    `;
  materialColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-4-column">№</div>
        <div class="manufacture-4-column">Товар</div>
        <div class="manufacture-4-column">Нал</div>
        <div class="manufacture-4-column">Кол-во</div>
      </div>
    `;
  goodColumnBody.innerHTML = `
      <div class="manufacture-header">
        <div class="manufacture-3-column">№</div>
        <div class="manufacture-3-column">Товар</div>
        <div class="manufacture-3-column">Кол-во</div>
      </div>
    `;
  cardsMarkupModal.drawDataInContainer(loadedNomenklatureCards, nomenklatureCardModalBody);

  manufactureStocks.innerHTML = manufactureData.data.all_stocks.map((item) => `<option value="${item.id}" ${(item.id === auth.data.currentStock) ? 'selected' : ''}>${item.name}</option>`).join('');
  currentGoods = [];
};

const getManufacture = () => {
  selectedNomenklatureCards = '';

  manufactureColumnBody.innerHTML = '';
  materialColumnBody.innerHTML = '';
  goodColumnBody.innerHTML = '';
  auth.currentStockId = auth.data.currentStock;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/operation/manufacture`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessManufactureLoad,
  };
};

$('#universal-modal-micro').on('shown.bs.modal', function () {
  $('#universal-modal-micro-name').trigger('focus');
});

export default {

  start() {
    manufactureList.addEventListener('click', getManufacture);
  },

  stop() {
    manufactureList.removeEventListener('click', getManufacture);
  }
};
