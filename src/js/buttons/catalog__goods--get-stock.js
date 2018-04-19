import auth from '../tools/storage.js';

const goodsStock = document.querySelector('#goods-stock-body');

const getStock = (allStocks, currentValue) => {

  console.log('getstocks');

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
        checkedStock = (auth.currentStockId === 'all') ? 1 : auth.currentStockId;
      }
      return `

      <label style="padding-left: 34px;" for="stock-${item.id}"  class="d-flex justify-content-between align-items-center reference-string good-card-stock-row" data-stock-id="${item.id}" data-stock-name="${item.name}" data-stock-t2="${item.values[2][0]}">
        <div class="row w-100 h-20">
          <div class="col-8">${item.name}</div>
          <div class="col-4 d-flex justify-content-between">
            <div class="w-100 text-center">${item.values[3][0]}</div>
            <div class="w-100 text-center">${item.values[2][0]}</div>
            <div class="w-100 text-center">${item.values[4][0]}</div>
          </div>
          </div>
          <input type="radio" id="stock-${item.id}" name="stock" value="email" class="d-none">
        </label>`;
    }).join(''));
    console.log(allStocks);
  }

  if (allStocks.length > 1) {
    goodsStock.insertAdjacentHTML('beforeend', `
      <div class="row w-100 h-20 " style="padding-left:24px;">
       <div class="col-8" style="padding-left:14px;"><h4>Итого:</h4></div>
          <div class="col-4 d-flex justify-content-between">
            <div class="w-100 text-center"> </div>
            <div class="w-100 text-center">${totalCount}</div>
            <div class="w-100 text-center"> </div>
          </div>
      </div>`);
  }

  // переписать на storage
  console.log(checkedStock);
  if (checkedStock) {
    goodsStock.querySelector(`#stock-${checkedStock}`).checked = true;
    auth.currentStockId = checkedStock;

    let tmpStock = goodsStock.querySelector(`#stock-${checkedStock}`);

    if (tmpStock.nextElementSibling) {
      auth.currentStockName = tmpStock.nextElementSibling.dataset.stockName;
    }

    let tmpStock2 = goodsStock.querySelector(`#stock-${checkedStock}`);

    if (tmpStock2.nextElementSibling) {
      auth.currentStockQuantityT2 = tmpStock2.nextElementSibling.dataset.stockT2;
    }

  } else if (goodsStock.firstChild.id) {
    goodsStock.firstChild.checked = true;
    auth.currentStockId = goodsStock.firstChild.id.split('-')[1];
    auth.currentStockName = goodsStock.children[1].dataset.stockName;
    auth.currentStockQuantityT2 = goodsStock.children[1].dataset.stockT2;
  }
};

export default {
  getStock
};
