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

      clickCallback();
    };

    container.innerHTML = '';

    let table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = '<thead><tr><th scope="col" class="">#</th><th scope="col" class="w-50">Товар</th><th scope="col">Кол-во</th><th scope="col"></th><th scope="col"></th></tr></thead>';

    let tbody = document.createElement('tbody');

    goods.forEach((good, index) => {
      let tr = document.createElement('tr');
      tr.scope = 'row';
      tr.dataset['id'] = good.id;
      tr.dataset['name'] = good.name;
      tr.dataset['count'] = good.count;
      tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${good.id} || ${good.name}</td>
        <td>${good.count}</td>
        <td>
          <button class="button btn btn-danger" data-type="add">+1</button>
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

  rightColumnGoods(nomenklature, container, clickCallback) {

    const clickHandler = (evt) => {
      let el = evt.target;

      while (!el.dataset['id']) {
        el = el.parentNode;
      }

      stor.currentGoodId = el.dataset['id'];

      clickCallback();
    };

    container.innerHTML = '';

    let fragment = document.createDocumentFragment();

    nomenklature.forEach((position, index) => {
      let tr = document.createElement('tr');
      tr.dataset['id'] = position.id;
      tr.scope = 'row';
      tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${position.name}</td>
        <td>${position.price}</td>
      `;

      tr.addEventListener('click', clickHandler);
      fragment.appendChild(tr);
    });

    container.appendChild(fragment);
  }
};
