import stor from './../tools/storage.js';

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

  leftColumnGoods(goods, container, clickCallback) {

    const clickHandler = (evt) => {
      let el = evt.target;

      while (!el.dataset['id']) {
        el = el.parentNode;
      }

      switch (evt.target.dataset['type']) {
      case 'add':
        stor.operationClickType = 'add';
        break;
      case 'card':
        stor.operationClickType = 'card';
        break;
      default:
        stor.operationClickType = 'def';
        break;
      }
      stor.operationTradeCurrentGoodId = el.dataset['id'];
      stor.operationTradeCurrentGoodName = el.dataset['name'];
      stor.operationTradeCurrentGoodCount = el.dataset['count'];
      stor.operationTradeCurrentGoodPrice = el.dataset['price'];

      clickCallback();
    };

    container.innerHTML = '';

    let table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = '<thead><tr><th scope="col" class="">#</th><th scope="col" class="w-50">Товар</th><th scope="col">Цена</th><th scope="col">Остаток</th><th scope="col"></th><th scope="col"></th></tr></thead>';

    let tbody = document.createElement('tbody');

    goods.forEach((good, index) => {
      let tr = document.createElement('tr');
      tr.scope = 'row';
      tr.dataset['id'] = good.id;
      tr.dataset['name'] = good.name;
      tr.dataset['count'] = good.count;
      tr.dataset['price'] = good.price;
      tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${good.id} || ${good.name}</td>
        <td>${good.price}</td>
        <td>${good.count}</td>
        <td>
          <button class="button btn btn-danger mr-1" data-type="add">+1</button>
        </td>
        <td>
          <button class="button btn btn-danger" data-type="card">i</button>
        </td>
      `;

      tr.addEventListener('click', clickHandler);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  },

  rightColumnGoods(index, name, count, price) {
    return `
      <th scope="row">${index + 1}</th>
      <td>${name}</td>
      <td>${count}</td>
      <td>${price}</td>
      <td>${price * count}</td>
    `;
  },

  rightColumnDiscount(name, count, price, discount) {
    return `
      <th scope="row">#</th>
      <td>${name}</td>
      <td>${discount}%</td>
      <td></td>
      <td>${price * count}</td>
    `;
  }
};
