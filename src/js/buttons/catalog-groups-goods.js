import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';

const goodsCard = document.querySelector('#goods-card');

const goodsCardName = document.querySelector('#goods-card-name');
const goodsCardDescribe = document.querySelector('#goods-card-describe');
const goodsCardBarcode = document.querySelector('#goods-card-barcode');
const goodsCardGroup = document.querySelector('#goods-card-group');

const goodsCardPrice = document.querySelector('#goods-card-price-purchase');
// const goodsCardPriceExtra = document.querySelector('#goods-card-price-extra');
const goodsCardSell = document.querySelector('#goods-card-price-sell');
const goodsStock = document.querySelector('#goods-stock');
const goodsKeywords = document.querySelector('#goods-keywords');
// import keywordsMarkup from '../markup/reference-keywords.js';

/*
              <div class="row border">
                <div class="col-8 border">11</div>
                <div class="col-4 d-flex justify-content-between border">
                  <div class="w-100 text-center border">22</div>
                  <div class="w-100 text-center border">33</div>
                  <div class="w-100 text-center border">44</div>
                </div>
              </div>
*/
const onSuccessGroupsLoad = (loadedGood) => {
  console.log(loadedGood);
  let {name, description, barcode, all_groups: allGroups, all_stocks: allStocks, current_value: currentValue, purchase_price: purchasePrice, selling_price: sellingPrice, tags} = loadedGood.data;
  goodsCardName.value = name;
  goodsCardDescribe.value = description;
  goodsCardBarcode.value = barcode;
  goodsCardGroup.insertAdjacentHTML('beforeend', allGroups.map((item) => `<option value="${item.id}">${item.name}</option>`).join(''));

  let stocksMarkup = [
    '<div class="w-100 text-center border"></div>',
    '<div class="w-100 text-center border"></div>',
    '<div class="w-100 text-center border"></div>'
  ];

  const getStocksTable = (stockId) => {
    // console.log(currentValue);
    if (currentValue) {
      let result = currentValue.find((item) => item.stock_id === stockId);
      let resArr = stocksMarkup.slice(0);
      if (result) {
        resArr[Number(result.type) - 1] = `<div class="w-100 text-center border">${result.value}</div>`;
      }
      return resArr;
    }
    return 0;
  };
  /*
  if (allStocks.length) {
    goodsStock.insertAdjacentHTML('beforeend', allStocks.map((item, index) => `
      <div class="row border">
        <div class="col-8 border">${item.id} - ${item.name} ${(item.id === auth.data.currentStock) ? '<b>V</b>' : ''}</div>
        <div class="col-4 d-flex justify-content-between border">
          ${getStocksTable(item.id).join('')}
        </div>
      </div>`).join(''));
  */

  if (allStocks.length) {
    goodsStock.insertAdjacentHTML('beforeend', allStocks.map((item, index) => `
    <input type="radio" id="stock-${item.id}" name="contact" value="email" class="d-none">
    <label style="padding-left: 34px;" for="${item.id}"  class="d-flex justify-content-between align-items-center reference-string" data-stock-id="${item.id}" data-stock-name="${item.name}">
      <div class="row border">
        <div class="col-8 border">${item.id} - ${item.name} ${(item.id === auth.data.currentStock) ? '<b>V</b>' : ''}</div>
        <div class="col-4 d-flex justify-content-between border">
          ${getStocksTable(item.id).join('')}
        </div>
        </div>
      </label>`).join(''));
  } else {
    goodsStock.insertAdjacentHTML('beforeend', `
      <div class="row border">
        <div class="col-8 border"></div>
        <div class="col-4 d-flex justify-content-between border">
          ${stocksMarkup.join('')}
        </div>
      </div>`);
  }
  goodsCardPrice.value = purchasePrice;
  goodsCardSell.value = sellingPrice;
  goodsKeywords.innerHTML = '';
  goodsKeywords.insertAdjacentHTML('beforeend', tags.length ? tags.map((item) => `<h3 style="display: inline-block;"><span class="badge keyword-row" style="background-color: #${item.color}; cursor: pointer; color: #fff">#${item.name}</span></h3>`) : 'Ключевых слов нет');
};

const getGood = (id) => {
  $(goodsCard).modal('show');

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/good/${id}/card_info`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupsLoad,
  };
};

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
