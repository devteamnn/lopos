// import stor from './../tools/storage.js';

export default {
  header(head, img) {
    return `
        <img src="${img}" alt="">
        <h2>${head}</h2>
      `;
  },

  leftColumnHeader(head, node) {
    return `
    <div class="catalog-header">
      <div class="catalog-header-title">
        ${node}
        <h2>${head}</h2>
      </div>
    </div>
    `;
  },

  leftColumnGoodsHeaderTrade() {
    return '<thead><tr><th scope="col" class="">#</th><th scope="col" class="w-50">Товар</th><th scope="col">Цена</th><th scope="col">Остаток</th><th scope="col"></th><th scope="col"></th></tr></thead>';
  },

  leftColumnGoodsHeaderInventory() {
    return '<thead><tr><th scope="col" class="">#</th><th scope="col" class="w-50">Товар</th><th scope="col">Остаток</th><th scope="col"></th></tr></thead>';
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
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td>${count}</td>
      <td>
        <button class="button btn btn-danger" data-type="card">i</button>
      </td>
    `;
  },

  rightColumnGoods(index, name, count, price) {
    return `
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td>${count}</td>
      <td>${price}</td>
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
