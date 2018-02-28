import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import uValid from './universal-validity-micro.js';
import toolsMarkup from '../markup/tools.js';
import cardsMarkup from '../markup/catalog-cards.js';

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

let loadedNomenklatureCards = '';
let selectedNomenklatureCards = '';
let currentGoods = [];
// #################### РАЗМЕТКА ДЛЯ ПОМЕЩЕНИЯ ТОВАРОВ В КОЛОНКИ ######################

const getGoodString = (id, name, good, index, value, classDanger) => {
  return `
  <div class="goods-string ${classDanger}" data-good-id="${id}">
    <div>
      <span class="reference-row-number">${index}</span> <span>${name}</span>
    </div>
    <div>
      <span>${(good) ? good : 'X' }</span>
      <span>${value}</span>
    </div>
  </div>`;
};

const drawGoodsToColumns = () => {
  let materialNumber = 0;
  let goodNumber = 0;
  materialColumnBody.innerHTML = '';
  goodColumnBody.innerHTML = '';
  manufactureCountBtn.removeAttribute('disabled');
  currentGoods = [];
  selectedNomenklatureCards.forEach((card) => {
    if (card.content) {
      card.content.forEach((good) => {
        currentGoods.push(good);
        if (good.value < 0) {
          materialNumber++;
          materialColumnBody.insertAdjacentHTML('beforeend', getGoodString(good.id, good.name, good.good, materialNumber, good.value * card.k, ''));
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
  materialColumnBody.innerHTML = '';
  goodColumnBody.innerHTML = '';
  for (let i = 0; i < data.data.length; i++) {
    if (currentGoods[i].value < 0) {
      materialNumber++;
      let classDanger = ((+data.data[i].value + +currentGoods[i].value) < 0) ? 'bg-danger' : '';
      materialColumnBody.insertAdjacentHTML('beforeend', getGoodString(currentGoods[i].id, currentGoods[i].name, data.data[i].value, materialNumber, currentGoods[i].value, classDanger));
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

const onManufactureColumnBodyClick = (evt) => {
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.cardId) {
    currentStringElement = currentStringElement.parentNode;
  }

  toolsMarkup.runUniversalModalMicro = {
    title: 'Укажите коэффициент',
    inputLabel: 'Коэффициент',
    inputPlaceholder: 'введите коэффициент',
    submitBtnName: 'Изменить',
    submitCallback() {
      // if (/^\-?\d+$/.test(document.querySelector('#universal-modal-micro-name').value)) {
      if (uValid.check([document.querySelector('#universal-modal-micro-name')])) {
        if (+document.querySelector('#universal-modal-micro-name').value === 0) {
          selectedNomenklatureCards.splice([currentStringElement.dataset.cardIndex], 1);
          document.querySelectorAll('.manufacture-nomenklature-card--muted')[currentStringElement.dataset.cardIndex].classList.remove('manufacture-nomenklature-card--muted');
        } else {
          selectedNomenklatureCards[currentStringElement.dataset.cardIndex].k = document.querySelector('#universal-modal-micro-name').value;
        }

        manufactureColumnBody.innerHTML = '';
        cardsMarkup.drawDataInContainer(selectedNomenklatureCards, manufactureColumnBody);
        drawGoodsToColumns();
        manufactureMakeBtn.setAttribute('disabled', 'disabled');
        document.querySelector('#universal-modal-micro-valid').innerHTML = '';
        $('#universal-modal-micro').modal('hide');

      }
      /*
      } else {
        document.querySelector('#universal-modal-micro-valid').innerHTML = 'Целое число';
      }
      */
    },
  };

};

manufactureColumnBody.addEventListener('click', onManufactureColumnBodyClick);


// #################### ОБРАБАТЫВАЕМ КЛИКИ ПО СПИСКУ КАРТОЧКЕ В МОДАЛЬНОМ ОКНЕ #############
$(nomenklatureCardModal).on('hidden.bs.modal', () => {
  selectedNomenklatureCards = [].map.call(document.querySelectorAll('.manufacture-nomenklature-card--muted'), (item) => Object.assign(loadedNomenklatureCards[item.dataset.cardIndex], {
    k: 1
  }));
  if (selectedNomenklatureCards.length !== 0) {
    manufactureColumnBody.innerHTML = '';
    cardsMarkup.drawDataInContainer(selectedNomenklatureCards, manufactureColumnBody);
    manufactureMaterialCheck.classList.add('d-none');
    drawGoodsToColumns();
  }
});


const onListCardBodyClick = (evt) => {
  let currentStringElement = evt.target;
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
  cardsMarkup.drawDataInContainer(loadedNomenklatureCards, nomenklatureCardModalBody);

  manufactureStocks.innerHTML = manufactureData.data.all_stocks.map((item) => `<option value="${item.id}" ${(item.id === auth.data.currentStock) ? 'selected' : ''}>${item.name}</option>`).join('');
  currentGoods = [];
};


const getManufacture = () => {

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


export default {

  start() {
    manufactureList.addEventListener('click', getManufacture);
  },

  stop() {
    manufactureList.removeEventListener('click', getManufacture);
  }
};