import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import keywordsUniversal from './universal-keywords.js';
import referenceKeywords from './reference-keywords.js';

import goodsExpressValidityAndSend from './catalog-groups-goods-express.js';
import stockForm from './catalog-groups-goods-stock.js';
import goodFormEdit from './catalog-groups-goods-edit.js';


const goodsCard = document.querySelector('#goods-card');
// const goodsCardForm = document.querySelector('#goods-card-form');

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
const goodsKeywords = document.querySelector('#goods-keywords');
const goodsCardKeywordsModal = document.querySelector('#goods-card-keywords');
const goodsCardKeywordsBody = document.querySelector('#goods-card-keywords-body');

const expressContainer = document.querySelector('#express-container');
const expressModal = document.querySelector('#express-modal');
const expressModalLabel = document.querySelector('#express-modal-label');
const expressModalStock = document.querySelector('#express-modal-stock');
const expressModalPrice = document.querySelector('#express-modal-price');
const expressModalQuantity = document.querySelector('#express-modal-quantity');
const stockModal = document.querySelector('#set-stock-modal');
const stockModalName = document.querySelector('#set-stock-modal-stock');
const stockModalQuantity = document.querySelector('#set-stock-modal-quantity');

let goodTags = [];
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
  if (formSave.name) {
    goodsCardName.value = formSave.name;
    goodsCardDescribe.value = formSave.describe;
    goodsCardBarcode.value = formSave.barcode;
    goodsCardGroup.value = formSave.group;
  }
};

const onSuccessGoodsLoad = (loadedGood) => {
  console.log(loadedGood);
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
  goodsCardName.value = name;
  goodsCardDescribe.value = description;
  goodsCardBarcode.value = barcode;
  goodsCardPurchase.value = purchasePrice;
  goodsCardSell.value = sellingPrice;
  goodsCardExtra.innerHTML = ((+sellingPrice - +purchasePrice) / (+purchasePrice / 100)).toFixed(2) + '%';

  goodTags = (tags) ? tags : [];

  goodsCardGroup.innerHTML = allGroups.map((item) => `<option value="${item.id}" ${(item.id === groupId ? 'selected' : '')}>${item.name}</option>`).join('');

  goodsCardImage.title = name;
  goodsCardImage.alt = name;
  goodsCardImage.src = imgUrl ? `https://lopos.bidone.ru/users/600a5357/images/${imgUrl}.jpg` : './img/not-available.png';

  let totalCount = 0;
  let checkedStock = false;

  if (allStocks.length) {
    allStocks.forEach((stockItem) => {
      stockItem.values = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
      if (currentValue.length) {
        currentValue.map((valueItem) => (valueItem.stock_id === stockItem.id) ? (stockItem.values[valueItem.type] = [valueItem.value, valueItem.type]) : '');
      }
    });
    goodsStock.insertAdjacentHTML('beforeend', allStocks.map((item) => {
      totalCount += +item.values[4][0] + +item.values[2][0] + +item.values[3][0];
      if (!auth.currentStockId) {
        checkedStock = (item.id === auth.data.currentStock) ? item.id : checkedStock;
      } else {
        checkedStock = auth.currentStockId;
      }
      return `
      <input type="radio" id="stock-${item.id}" name="stock" value="email" class="d-none">
      <label style="padding-left: 34px;" for="stock-${item.id}"  class="d-flex justify-content-between align-items-center reference-string" data-stock-id="${item.id}" data-stock-name="${item.name}" data-stock-t2="${item.values[2][0]}">
        <div class="row w-100 h-100">
          <div class="col-8">${item.name}</div>
          <div class="col-4 d-flex justify-content-between">
            <div class="w-100 text-center">${item.values[3][0]}</div>
            <div class="w-100 text-center">${item.values[2][0]}</div>
            <div class="w-100 text-center">${item.values[4][0]}</div>
          </div>
          </div>
        </label>`;
    }).join(''));
    console.log(allStocks);
  }

  if (allStocks.length > 1) {
    goodsStock.insertAdjacentHTML('beforeend', `
      <div class="row border">
        <div class="col-8 border">Итого</div>
        <div class="col-4 text-center">
          ${totalCount}
        </div>
      </div>`);
  }

  console.log(checkedStock);
  if (checkedStock) {
    goodsStock.querySelector(`#stock-${checkedStock}`).checked = true;
    auth.currentStockId = checkedStock;
    auth.currentStockName = goodsStock.querySelector(`#stock-${checkedStock}`).nextElementSibling.dataset.stockName;
    auth.currentStockQuantityT2 = goodsStock.children[1].dataset.stockT2;
  } else if (goodsStock.firstChild.id) {
    goodsStock.firstChild.checked = true;
    auth.currentStockId = goodsStock.firstChild.id.split('-')[1];
    auth.currentStockName = goodsStock.children[1].dataset.stockName;
    auth.currentStockQuantityT2 = goodsStock.children[1].dataset.stockT2;
  }

  keywordsUniversal.downloadAndDraw(goodsCardKeywordsBody, onKeywordClick, keywordModificator);

  const onGoodKeywordClick = (evt) => {
    auth.isGoodCardEdit = true;
    saveForm();
    const returnHandler = (e) => {
      // $('#list-keywords-list').tab('hide');
      getGood();
      $('#list-groups-list').tab('show');
      $('#goods-card').modal('show');
      e.target.removeEventListener('click', returnHandler);

    };
    referenceKeywords.showKeywordEdit(evt, returnHandler);
    $('#goods-card').modal('hide');
    $('#list-keywords-list').tab('show');
  };

  goodsKeywords.innerHTML = '';
  if (goodTags.length) {
    goodTags.forEach((item) => keywordsUniversal.getDataAndDraw(goodsKeywords, onGoodKeywordClick, item));
  } else {
    goodsKeywords.innerHTML = 'Ключевых слов нет';
  }
  console.log('fillForm');
  if (auth.isGoodCardEdit === 'true') {
    restoreForm();
  }
  auth.isGoodCardEdit = false;

};

// обработчик клика по ключевому слову (пока внутри карточки связей "товар-слово")
const onKeywordClick = (evt) => {
  let clickedKeywordNode = evt.target;
  const onSuccessKeywordsCompare = (keywordNode) => clickedKeywordNode.classList.toggle('keyword__mute');
  let xhrType = (goodTags.every((tagItem) => (tagItem.id !== clickedKeywordNode.dataset.keywordId))) ? 'POST' : 'DELETE';
  xhr.request = {
    metod: xhrType,
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${clickedKeywordNode.dataset.keywordId}/compare_meta`,
    data: `good=${auth.currentGoodId}&token=${auth.data.token}`,
    callbackSuccess: onSuccessKeywordsCompare,
  };
};

// установка прозрачности
const keywordModificator = (keywordId, keywordNode) => {
  if (goodTags.every((tagItem) => (tagItem.id !== keywordId))) {
    keywordNode.classList.add('keyword__mute');
  }
};


$(goodsCardKeywordsModal).on('shown.bs.modal', () => {
  auth.isGoodCardEdit = true;
  saveForm();
  keywordsUniversal.downloadAndDraw(goodsCardKeywordsBody, onKeywordClick, keywordModificator);
  $(goodsCard).modal('hide');
  goodFormEdit.removeHandlers();
});

$(goodsCardKeywordsModal).on('hidden.bs.modal', () => {
  getGood();
});

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
  window.setTimeout(function () {
    $(currentExpressBtn).popover('dispose');
    expressContainer.querySelectorAll('BUTTON').forEach((btn) => btn.removeAttribute('disabled', 'disabled'));
  }, 1000);
};
const onExpressContainerClick = (evt) => {
  let multiplier = null;
  let value = null;
  let price = null;
  console.log(evt.target.id);
  console.log(evt.target.id.indexOf('express-operation'));
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
      // $(goodsCard).modal('hide');
      $(expressModal).modal('show');


      console.log(formSave);
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
  $(goodsCard).modal('toggle');
});

const getGood = () => {
  $(goodsCard).modal('show');
  goodsStock.innerHTML = '';
  goodFormEdit.start(goodsCard);

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


const showPreview = (file) => {
  let fileName = file.name.toLowerCase();
  let fileSize = (file.size / 1024 / 1024).toFixed(2);

  if (fileName.endsWith('jpg') && fileSize < 2) {
    let reader = new FileReader();

    reader.addEventListener('load', function () {
      goodsCardImage.src = reader.result;
    });
    reader.readAsDataURL(file);
  } else if (!fileName.endsWith('jpg')) {
    goodsCardImage.src = '';
    goodsCardImageUpload.value = '';
    goodsCardImage.alt = `Формат ${fileName.slice(-3)} не катит, только jpg`;
  } else if (fileSize > 2) {
    goodsCardImage.src = '';
    goodsCardImageUpload.value = '';
    goodsCardImage.alt = `Размер ${fileSize}Mb слишком велик`;
  }
};

goodsCardImageUpload.addEventListener('change', function () {
  showPreview(goodsCardImageUpload.files[0]);
});

// ================= превью картинки =================

export default {

  start() {
    // вешаем обработчики на кнопки
    // listGroups.addEventListener('click', getGroups);
  },

  // заполняем карточку
  fill: getGood,

  stop() {
    // снимаем обработчики
    // groupsMarkup.cleanContainer();
    // listGroups.removeEventListener('click', getGroups);
  }
};
