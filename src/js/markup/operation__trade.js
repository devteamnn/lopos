// import stor from './../tools/storage.js';

export default {
  header(head, img) {
    return `
        <img src="${img}" alt="">
        <h3 class="header_first_level_in_modal">${head}</h3>
      `;
  },

  leftColumnHeader(head, node) {
    return `
    <div class="catalog-header">
      <div class="catalog-header-title">
        ${node}
        <h3 class="header_second_level_in_modal">${head}</h3>
      </div>
    </div>
    `;
  },

  leftColumnGoodsHeaderTrade() {
    return '<thead class="inventory-header"><tr ><th scope="col" >№</th><th scope="col" class="w-50">Товар</th><th scope="col">Цена</th><th scope="col">Остаток</th><th scope="col"></th><th scope="col"></th></tr></thead>';
  },

  leftColumnGoodsHeaderInventory() {
    return '<thead class="inventory-header" ><tr><th scope="col" class="inventory-header-row" ><div>№</div></th><th scope="col" height="30"  class="inventory-header-row"><div>Товар</div></th><th scope="col"  class="inventory-header-row" ><div>Остаток</div></th></tr></thead>';
  },

  leftColumnGoodsRowTrade(index, name, price, count) {
    return `
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td>${price}</td>
      <td>${count}</td>
      <td>
        <button class="button btn btn-danger mr-1" data-type="add">+1</button>
      </td>
      <td>
        <button class="button btn btn-danger" data-type="card">i</button>
      </td>
    `;
  },

  leftColumnGoodsRowInventory(index, name, price, count) {
    return `
      <td>${index + 1}</td>
      <td>${name}</td>
      <td>${count}</td>
    `;
  },

  rightColumnGoodsPurchase(id, index, name, count, price, sumPurchase, markupGood, priceSell, currMarkup, sumSale) {
    let markupColor;
    currMarkup = Number(currMarkup);
    markupGood = Number(markupGood);

    if (currMarkup >= 0) {
      markupColor = (currMarkup <= markupGood) ? 'text-info' :
      'operation-trade-marckup-orange';
    } else {
      markupColor = 'text-danger';
    }

    return `
      <th scope="row">${index + 1}</th>
      <td style="width:100%;" >${name}</td>
      <td data-click="true" style="text-align: right;">
        <span class="w-100" data-click="true">${count}</span>
        <input type="text"  class="w-100 d-none" placeholder=${count} name="count" data-oldValue=${count} data-valisettings="operationPurchase" data-valid="count">
      </td>
         <td>x</td>
      <td>
        <span class="w-100" data-click="true">${price}</span>
        <input type="text" class="w-100 d-none" placeholder=${price} name="price" data-oldValue=${price} data-valisettings="operationPurchase" data-valid="price">
      </td>
      <td>=</td>
      <td data-click="true">
        <span class="w-100" data-click="true">
          ${sumPurchase}
        </span>
        <input type="text" class="w-100 d-none" placeholder=${sumPurchase} name="sumPurchase" data-oldValue=${sumPurchase} data-valisettings="operationPurchase" data-valid="PurchaseSum">
      </td>
      <td data-click="true" class="${markupColor}">
       <span class="w-100" data-click="true">${currMarkup}%</span>
       <input type="text" class="w-100 d-none" placeholder=${currMarkup} name="currMarkup" data-oldValue=${currMarkup} data-valisettings="operationPurchase" data-valid="currMarkup">
      </td>
      <td class="text-secondary">${markupGood}%</td>
      <td data-click="true">
        <span class="w-100" data-click="true">${priceSell}</span>
        <input type="text" class="w-100 d-none" placeholder=${priceSell} name="priceSell" data-oldValue=${priceSell} data-valisettings="operationPurchase" data-valid="sellPrice">
      </td>
      <td data-click="true">
        <span class="w-100" data-click="true">${sumSale}</span>
        <input type="text" class="w-100 d-none" placeholder=${sumSale} name="sumSale" data-oldValue=${sumSale} data-valisettings="operationPurchase" data-valid="sellSum">
      </td>
    `;
  },

  rightColumnGoodsSale(index, name, count, price) {
    return `
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td style="text-align: right;">${count}</td>
      <td>x</td>
      <td>${price}</td>
      <td>=</td>
      <td>${Number(price * count).toFixed(2)}</td>
    `;
  },

  rightColumnDiscount(name, count, price, discount) {
    return `
      <th scope="row">#</th>
      <td>${name}</td>
      <td>${discount}%</td>
      <td></td>
      <td>${Number(price * count).toFixed(2)}</td>
    `;
  },

  rightColumnGoodsInventory(index, name, count, oldCount) {
    return `
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td>${oldCount}</td>
      <td>${Number(count - oldCount).toFixed(2)}</td>
      <td>${count}</td>
    `;
  },

};
