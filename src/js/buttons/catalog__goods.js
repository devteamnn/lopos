import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';

import goodsExpressValidityAndSend from './catalog__goods--express.js';
import stockForm from './catalog__goods--stock.js';
import goodFormEdit from './catalog__goods--edit.js';
import groups from './catalog__groups.js';
import getStock from './catalog__goods--get-stock.js';
import getKeywords from './catalog__goods--get-keywords.js';

const goodsCard = document.querySelector('#goods-card');
const goodsCardName = document.querySelector('#goods-card-name');
const goodsCardDescribe = document.querySelector('#goods-card-describe');
const goodsCardBarcode = document.querySelector('#goods-card-barcode');
const goodsCardGroup = document.querySelector('#goods-card-group');

const goodsCardImage = document.querySelector('#goods-card-image');
const goodsCardImageUpload = document.querySelector('#goods-card-image-upload');
const goodsCardPurchase = document.querySelector('#goods-card-price-purchase');
const goodsCardSell = document.querySelector('#goods-card-price-sell');
const goodsCardExtra = document.querySelector('#goods-card-price-extra');
const goodsStock = document.querySelector('#goods-stock-body');
const goodsCardKeywordsModal = document.querySelector('#goods-card-keywords');

const expressContainer = document.querySelector('#express-container');
const expressModal = document.querySelector('#express-modal');
const expressModalLabel = document.querySelector('#express-modal-label');
const expressModalStock = document.querySelector('#express-modal-stock');
const expressModalPrice = document.querySelector('#express-modal-price');
const expressModalQuantity = document.querySelector('#express-modal-quantity');
const stockModal = document.querySelector('#set-stock-modal');
const stockModalName = document.querySelector('#set-stock-modal-stock');
const stockModalQuantity = document.querySelector('#set-stock-modal-quantity');

// ############################## РАБОТА С ТОВАРАМИ (СПИСОК) ##############################
import goodsAdd from './catalog__goods--add.js';
import goodsList from './universal-goods-list.js';
import search from './universal-search.js';

const listGroupGoodsAddModal = document.querySelector('#group-goods-add');
const listGroupGoodsAddModalName = document.querySelector('#group-goods-name');
const listGroupGoodsAddModalDescribe = document.querySelector('#group-goods-describe');
const listGroupGoodsAddModalPurchase = document.querySelector('#group-goods-price-purchase');
const listGroupGoodsAddModalExtra = document.querySelector('#group-goods-price-extra');
const listGroupGoodsAddModalSell = document.querySelector('#group-goods-price-sell');
const listGroupGoodsAddModalBarcode = document.querySelector('#group-goods-barcode');
const listGroupGoodsCardCopyBtn = document.querySelector('#group-goods-copy-btn');
const listGroupGoodsCardAddBtn = document.querySelector('#group-goods-add-btn');
const listGroupsGoodsCardCheckMessage = document.querySelector('#list-groups-goods-header-check-message');
const groupGoodsReturnBtn = document.querySelector('#group-goods-return-btn');
const groupGoodsAddSubmitBtn = document.querySelector('#group-goods-add-submit');
const groupGoodsAddLabel = document.querySelector('#group-goods-add-label');
const goodsSortModal = document.querySelector('#group-goods-sort');
const groupGoodsBody = document.querySelector('#group-goods-card-body');

const groupGoodsCard = document.querySelector('#group-goods-card');
const listGroupsCard = document.querySelector('#list-groups-card');

const SELECT_DELAY = 2000;

let loadedGoods = [];

// поиск по товарам
const goodsCardSearch = document.querySelector('#list-groups-goods-search-input');
goodsCardSearch.addEventListener('input', (evt) => {
  goodsList.draw(search.make(loadedGoods.data, evt.target.value), groupGoodsBody, onGoodClick);
});

// заполнение карточки копирования товара
const fillCopyCard = (loadedGoodData) => {
  let {
    name,
    description,
    barcode,
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
  } = loadedGoodData.data;
  purchasePrice = Number(purchasePrice).toFixed(2);
  sellingPrice = Number(sellingPrice).toFixed(2);
  listGroupGoodsAddModalName.value = name;
  listGroupGoodsAddModalDescribe.value = description;
  listGroupGoodsAddModalPurchase.value = +purchasePrice;
  listGroupGoodsAddModalSell.value = +sellingPrice;
  listGroupGoodsAddModalExtra.value = ((+sellingPrice - +purchasePrice) / (+purchasePrice / 100)).toFixed(2);
  listGroupGoodsAddModalBarcode.value = barcode;
};

const onListGroupGoodsCardAddBtn = () => {
  groupGoodsAddSubmitBtn.innerHTML = 'Создать';
  groupGoodsAddLabel.innerHTML = 'Создание товара';
  goodsAdd.start(listGroupGoodsAddModal);
};

const onListGroupGoodsCardCopyBtn = (evt) => {
  auth.goodListOperationType = 'copy';
  listGroupsGoodsCardCheckMessage.innerHTML = 'Выберите товар';
  groupGoodsAddSubmitBtn.innerHTML = 'Скопировать';
  groupGoodsAddLabel.innerHTML = 'Копирование товара';
  window.setTimeout(function () {
    listGroupsGoodsCardCheckMessage.innerHTML = '';
    auth.goodListOperationType = 'open';
  }, SELECT_DELAY);
};


listGroupGoodsCardCopyBtn.addEventListener('click', onListGroupGoodsCardCopyBtn);
listGroupGoodsCardAddBtn.addEventListener('click', onListGroupGoodsCardAddBtn);

// получения списка товаров в группе и его отрисовка
const onSuccessGroupGood = (goodsData) => {
  loadedGoods = goodsData;
  if (auth.goodsSortMode && loadedGoods.data) {
    universalSort(auth.goodsSortMode);
  }
  auth.goodsViewMode = (auth.goodsViewMode === 'null') ? 'string' : auth.goodsViewMode;
  console.log('hihi');
  goodsList.draw(goodsData.data, groupGoodsBody, onGoodClick);
};

// обработчик клика по ноде товара
const onGoodClick = () => {
  if (auth.goodListOperationType === 'copy') {
    listGroupsGoodsCardCheckMessage.innerHTML = 'Выберите товар';
    groupGoodsAddSubmitBtn.innerHTML = 'Скопировать';
    groupGoodsAddLabel.innerHTML = 'Копирование товара';
    $(listGroupGoodsAddModal).modal('show');
    goodsAdd.start(listGroupGoodsAddModal);
    xhr.request = {
      metod: 'POST',
      url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/card_info`,
      data: `view_last=0&token=${auth.data.token}`,
      callbackSuccess: fillCopyCard,
    };
  } else if (auth.goodListOperationType === 'open' || !auth.goodListOperationType) {
    getGood();
  }
};

// сортировка товаров (массив данных пока по замыканию)
const universalSort = (sortType) => {
  switch (sortType) {
  case 'group-goods-sort-abc-up':
    loadedGoods.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
    break;
  case 'group-goods-sort-abc-down':
    loadedGoods.data.sort((a, b) => (b.name > a.name) ? 1 : -1);
    break;
  case 'group-goods-sort-tailings-up':
    loadedGoods.data.sort((a, b) => a.count - b.count);
    break;
  case 'group-goods-sort-tailings-down':
    loadedGoods.data.sort((a, b) => b.count - a.count);
    break;
  }
  auth.goodsSortMode = sortType;
  goodsList.draw(loadedGoods.data, groupGoodsBody, onGoodClick);
  $(goodsSortModal).modal('hide');
};

const onGoodsSortModalClick = (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    universalSort(evt.target.id);
  }
};
goodsSortModal.addEventListener('click', onGoodsSortModalClick);

// кнопка возврата на список групп
const onGroupGoodsReturnBtnClick = () => {
  groupGoodsCard.classList.add('d-none');
  listGroupsCard.classList.remove('d-none');
  groups.redraw();
};
groupGoodsReturnBtn.addEventListener('click', onGroupGoodsReturnBtnClick);

// переключение режимов отрисовки товаров
const groupGoodsViewBtn = document.querySelector('#group-goods-view-btn');
const onGroupGoodsViewBtnClick = () => {
  if (auth.goodsViewMode === 'string') {
    auth.goodsViewMode = 'metro';
    groupGoodsViewBtn.classList.add('icon-btn__view-tiles');
  } else if (auth.goodsViewMode === 'metro') {
    auth.goodsViewMode = 'string';
    groupGoodsViewBtn.classList.remove('icon-btn__view-tiles');
  }
  goodsList.draw(loadedGoods.data, groupGoodsBody, onGoodClick);

};
groupGoodsViewBtn.addEventListener('click', onGroupGoodsViewBtnClick);

// ############################## РАБОТА С ТОВАРАМИ (Карточка) ##############################


let formSave = {};

const saveForm = () => {
  formSave = {
    name: goodsCardName.value,
    describe: goodsCardDescribe.value,
    barcode: goodsCardBarcode.value,
    group: goodsCardGroup.value,
  };
};

const restoreForm = () => {
  if (auth.isGoodCardEdit === 'true') {
    goodsCardName.value = formSave.name;
    goodsCardDescribe.value = formSave.describe;
    goodsCardBarcode.value = formSave.barcode;
    goodsCardGroup.value = formSave.group;
  }
  auth.isGoodCardEdit = false;
};

let goodTags = [];

const onSuccessGoodsLoad = (loadedGood) => {
  console.log(loadedGood);

  // разбираем данные
  let {
    name,
    description,
    barcode,
    all_groups: allGroups,
    all_stocks: allStocks,
    current_value: currentValue,
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
    tags,
    img_url: imgUrl,
    group_id: groupId
  } = loadedGood.data;
  purchasePrice = Number(purchasePrice).toFixed(2);
  sellingPrice = Number(sellingPrice).toFixed(2);

  // заполняем форму - сведения о товаре
  goodsCardName.value = name;
  goodsCardDescribe.value = description;
  goodsCardBarcode.value = barcode;
  goodsCardPurchase.value = purchasePrice;
  goodsCardSell.value = sellingPrice;
  goodsCardExtra.innerHTML = ((+sellingPrice - +purchasePrice) / (+purchasePrice / 100)).toFixed(2) + '%';
  goodsCardGroup.innerHTML = allGroups.map((item) => `<option value="${item.id}" ${(item.id === groupId ? 'selected' : '')}>${item.name}</option>`).join('');
  goodsCardImage.title = name;
  goodsCardImage.alt = name;
  goodsCardImage.src = imgUrl ? `https://lopos.bidone.ru/users/600a5357/images/${imgUrl}.jpg` : './img/not-available.png';

  // заполняем форму - остатки
  getStock.getStock(allStocks, currentValue);

  // заполняем форму - ключевые слова и работа с ними
  goodTags = (tags) ? tags : [];

  getKeywords.getKeywords(goodTags);

  if (auth.isGoodCardEdit === 'true') {
    restoreForm();
  }
  auth.isGoodCardEdit = false;

  goodFormEdit.start(goodsCard);

  // восстановление состояния формы
  restoreForm();
};

$(goodsCardKeywordsModal).on('shown.bs.modal', () => {
  saveForm();
});

getKeywords.getKeywords(goodTags);

goodsStock.addEventListener('change', (evt) => {
  auth.currentStockId = Number(evt.target.id.split('-')[1]);
  auth.currentStockName = evt.target.labels[0].dataset.stockName;
  auth.currentStockQuantityT2 = evt.target.labels[0].dataset.stockT2;
});

let currentExpressBtn = '';

const onSuccessExpressExecute = (answer) => {
  console.log(answer);
  $(currentExpressBtn).popover({
    content: answer.message,
    placement: 'top'
  }).popover('show');
  getGood();
  getGoodsForGroup();
  window.setTimeout(function () {
    $(currentExpressBtn).popover('dispose');
    expressContainer.querySelectorAll('BUTTON').forEach((btn) => btn.removeAttribute('disabled', 'disabled'));
  }, 1000);
};
const onExpressContainerClick = (evt) => {
  let multiplier = null;
  let value = null;
  let price = null;
  if (evt.target.tagName === 'BUTTON') {
    let currentBtnId = evt.target.id;
    multiplier = (currentBtnId.indexOf('minus') !== -1) ? -1 : 1;
    price = (currentBtnId.indexOf('purchase') !== -1) ? Number(goodsCardPurchase.value) : Number(goodsCardSell.value);
    value = (currentBtnId.indexOf('express-operation') !== -1) ? Number(currentBtnId.split('-')[3]) * multiplier : '';
    currentExpressBtn = evt.target;

    if (currentBtnId.indexOf('operation') !== -1) {
      expressContainer.querySelectorAll('BUTTON').forEach((btn) => btn.setAttribute('disabled', 'disabled'));
      xhr.request = {
        metod: 'POST',
        url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/stock/${auth.currentStockId}/express`,
        data: `value=${value}&price=${price}&token=${auth.data.token}`,
        callbackSuccess: onSuccessExpressExecute,
      };
    } else if (currentBtnId.indexOf('custom') !== -1) {
      $(expressModal).modal('show');
      $(goodsCard).modal('toggle');
      goodFormEdit.removeHandlers();

      expressModalLabel.innerHTML = (currentBtnId.indexOf('purchase') !== -1) ? 'Экспресс-закупка' : 'Экспресс-продажа';
      expressModalStock.innerHTML = auth.currentStockName;
      expressModalPrice.value = (currentBtnId.indexOf('purchase') !== -1) ? goodsCardPurchase.value : goodsCardSell.value;
      expressModalQuantity.value = '';
      expressModalQuantity.focus();
      auth.expressOperationType = multiplier;
      goodsExpressValidityAndSend.start(expressModal);
    }
    auth.isGoodCardEdit = true;
    saveForm();

  }
};

expressContainer.addEventListener('click', onExpressContainerClick);

$(expressModal).on('hidden.bs.modal', () => {
  console.log(formSave);
  goodsExpressValidityAndSend.stop();
  getGood();
  getGoodsForGroup();
  $(goodsCard).modal('toggle');
});

const getGood = () => {
  $(goodsCard).modal('show');
  goodsStock.innerHTML = '';

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/card_info`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGoodsLoad,
  };
};

$(stockModal).on('hidden.bs.modal', () => {
  stockForm.stop();
  getGood();
});

$(stockModal).on('shown.bs.modal', () => {
  $(goodsCard).modal('hide');

  goodFormEdit.removeHandlers();

  stockModalName.innerHTML = auth.currentStockName;
  stockModalQuantity.value = auth.currentStockQuantityT2;
  auth.isGoodCardEdit = true;
  saveForm();
  stockForm.start(stockModal);

});

const getGoodsForGroup = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}/goods`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupGood,
  };
};

// ================= превью картинки =================
const showPreview = (file) => {
  let fileName = file.name.toLowerCase();
  let fileSize = (file.size / 1024 / 1024).toFixed(2);

  if ((fileName.endsWith('jpg') || fileName.endsWith('png')) && fileSize < 2) {
    let reader = new FileReader();

    reader.addEventListener('load', function () {
      goodsCardImage.src = reader.result;
    });
    reader.readAsDataURL(file);
  } else if (!fileName.endsWith('jpg')) {
    goodsCardImage.src = '';
    goodsCardImageUpload.value = '';
    goodsCardImage.alt = `Формат ${fileName.slice(-3)} не катит, только jpg или png`;
  } else if (fileSize > 2) {
    goodsCardImage.src = '';
    goodsCardImageUpload.value = '';
    goodsCardImage.alt = `Размер ${fileSize}Mb слишком велик`;
  }
};

goodsCardImageUpload.addEventListener('change', function () {
  showPreview(goodsCardImageUpload.files[0]);
});

export default {
  fill: getGood,
  onSuccessGroupGood,
  redraw: getGoodsForGroup,


};
