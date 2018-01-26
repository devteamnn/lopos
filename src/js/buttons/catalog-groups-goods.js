import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';

const goodsCard = document.querySelector('#goods-card');

const goodsCardName = document.querySelector('#goods-card-name');
const goodsCardDescribe = document.querySelector('#goods-card-describe');
const goodsCardBarcode = document.querySelector('#goods-card-barcode');
const goodsCardGroup = document.querySelector('#goods-card-group');

const goodsCardPurchase = document.querySelector('#goods-card-price-purchase');
const goodsCardImage = document.querySelector('#goods-card-image');
// const goodsCardPriceExtra = document.querySelector('#goods-card-price-extra');
const goodsCardSell = document.querySelector('#goods-card-price-sell');
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
// const expressPurchase = document.querySelector('#express-purchase');
// const expressSell = document.querySelector('#express-sell');
// import keywordsMarkup from '../markup/reference-keywords.js';

const loaderSpinnerId = 'loader-goods';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);
let goodTags = [];

const onSuccessGroupsLoad = (loadedGood) => {
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
  goodsCardName.value = name;
  goodsCardDescribe.value = description;
  goodsCardBarcode.value = barcode;
  goodsCardPurchase.value = purchasePrice;
  goodsCardSell.value = sellingPrice;
  goodTags = (tags) ? tags : [];
  /*
  goodsCardGroup.innerHTML = '<option selected>Выберите группу</option>';
  goodsCardGroup.insertAdjacentHTML('beforeend', allGroups.map((item) => `<option value="${item.id}">${item.name}</option>`).join(''));
  */
  goodsCardGroup.innerHTML = allGroups.map((item) => `<option value="${item.id}" ${(item.id === groupId ? 'selected' : '')}>${item.name}</option>`).join('');
  /*
  goodsCardGroup.innerHTML = allGroups.map((item) => {
    if
    return `<option value="${item.id}">${item.name}</option>`;
  }.join('');
  */
  console.log(goodsCardImage);
  goodsCardImage.title = name;
  goodsCardImage.alt = name;
  goodsCardImage.src = imgUrl ? `https://lopos.bidone.ru/users/600a5357/images/${imgUrl}.jpg` : './img/not-available.png';

  let totalCount = 0;
  let checkedStock = false;

  if (allStocks.length) {
    allStocks.forEach((stockItem) => {
      stockItem.values = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
      currentValue.map((valueItem) => (valueItem.stock_id === stockItem.id) ? (stockItem.values[valueItem.type] = [valueItem.value, valueItem.type]) : '');
    });
    goodsStock.insertAdjacentHTML('beforeend', allStocks.map((item) => {
      totalCount += +item.values[4][0] + +item.values[2][0] + +item.values[3][0];
      checkedStock = (item.id === auth.data.currentStock) ? item.id : checkedStock;
      return `
      <input type="radio" id="stock-${item.id}" name="stock" value="email" class="d-none">
      <label style="padding-left: 34px;" for="stock-${item.id}"  class="d-flex justify-content-between align-items-center reference-string" data-stock-id="${item.id}" data-stock-name="${item.name}" data-stock-t2="${item.values[2][0]}">
        <div class="row w-100">
          <div class="col-8">${item.id} - ${item.name}</div>
          <div class="col-4 d-flex justify-content-between border">
            <div class="w-100 text-center border">${item.values[3][0]}</div>
            <div class="w-100 text-center border">${item.values[2][0]}</div>
            <div class="w-100 text-center border">${item.values[4][0]}</div>
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
  } else {
    goodsStock.firstChild.checked = true;
    auth.currentStockId = goodsStock.firstChild.id.split('-')[1];
    auth.currentStockName = goodsStock.children[1].dataset.stockName;
    auth.currentStockQuantityT2 = goodsStock.children[1].dataset.stockT2;
  }
  // goodsCardPurchase.value = purchasePrice;
  // goodsCardSell.value = sellingPrice;
  goodsKeywords.innerHTML = '';
  goodsKeywords.insertAdjacentHTML('beforeend', tags.length ? tags.map((item) => `<h3 style="display: inline-block;"><span class="badge keyword-row" style="background-color: #${item.color}; cursor: pointer; color: #fff">#${item.name}</span></h3>`).join('') : 'Ключевых слов нет');
};

goodsStock.addEventListener('change', (evt) => {
  console.log(evt);
  console.log(evt.target.labels[0].innerText);
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
  window.setTimeout(function () {
    $(currentExpressBtn).popover('dispose');
  }, 2000);
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

    console.log(`lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/stock/${auth.currentStockId}/express`);
    console.log(`value=${value}&price=${price}&token=${auth.data.token}`);

    if (currentBtnId.indexOf('operation') !== -1) {
      xhr.request = {
        metod: 'POST',
        url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/stock/${auth.currentStockId}/express`,
        data: `value=${value}&price=${price}&token=${auth.data.token}`,
        callbackSuccess: onSuccessExpressExecute,
      };
    } else if (currentBtnId.indexOf('custom') !== -1) {
      // $(goodsCard).modal('hide');
      $(expressModal).modal('toggle');
      $(goodsCard).modal('toggle');

      expressModalLabel.innerHTML = (currentBtnId.indexOf('purchase') !== -1) ? 'Экспресс-закупка' : 'Экспресс-продажа';
      expressModalStock.innerHTML = auth.currentStockName;
      expressModalPrice.value = (currentBtnId.indexOf('purchase') !== -1) ? goodsCardPurchase.value : goodsCardSell.value;
      expressModalQuantity.focus();
    }

  }
};

expressContainer.addEventListener('click', onExpressContainerClick);

// $(expressModal).on('hide.bs.modal', () => $(goodsCard).modal({focus: true}));
$(expressModal).on('hidden.bs.modal', () => {
  $(goodsCard).modal('toggle');
  // $(goodsCard).modal('show');
});

const getGood = () => {
  $(goodsCard).modal('show');
  goodsStock.innerHTML = '';

  console.log(`lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/card_info`);

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${auth.currentGoodId}/card_info`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupsLoad,
  };
};

const onSuccessKeywordsLoad = (loadedKeywords) => {

  document.querySelector(`#${loaderSpinnerId}`).remove();
  console.log(loadedKeywords);

  const onSuccessKeywordsCompare = (keywordNode, opacity) => {
    keywordNode.style.opacity = opacity;
  };

  if (loadedKeywords.status === 200 && loadedKeywords.data) {
    loadedKeywords.data.forEach((item) => {
      goodsCardKeywordsBody.insertAdjacentHTML('beforeend', `<h3 style="display: inline-block;"><span class="badge keyword-row" style="background-color: #${item.hex_color}; cursor: pointer; color: #fff; ${(goodTags.every((tagItem) => (tagItem.id !== item.id))) ? 'opacity: 0.4;' : ''}" data-keyword-Id=${item.id}>#${item.name}</span></h3>`);


      goodsCardKeywordsBody.lastChild.addEventListener('click', function (evt) {
        let xhrType = (goodTags.every((tagItem) => (tagItem.id !== item.id))) ? 'POST' : 'DELETE';
        xhr.request = {
          metod: xhrType,
          url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${item.id}/compare_meta`,
          data: `good=${auth.currentGoodId}&token=${auth.data.token}`,
          callbackSuccess: onSuccessKeywordsCompare.bind(null, evt.target, (goodTags.every((tagItem) => (tagItem.id !== item.id))) ? '1' : '0.4'),
        };
      });


    });
  } else if (loadedKeywords.status === 200 && !loadedKeywords.data) {
    goodsCardKeywordsBody.innerHTML = `<p>${loadedKeywords.message || 'Что-то в поле message пусто и в data лежит false'}</p>`;
  }
};

const getKeywords = () => {
  goodsCardKeywordsBody.innerHTML = loaderSpinnerMarkup;

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessKeywordsLoad,
  };
};

$(goodsCardKeywordsModal).on('shown.bs.modal', () => {
  getKeywords();
  $(goodsCard).modal('hide');
});

$(goodsCardKeywordsModal).on('hidden.bs.modal', () => {
  getGood();
});

$(stockModal).on('hidden.bs.modal', () => {
  getGood();
});

$(stockModal).on('shown.bs.modal', () => {
  $(goodsCard).modal('hide');
  stockModalName.innerHTML = auth.currentStockName;
  stockModalQuantity.value = auth.currentStockQuantityT2;
});

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
