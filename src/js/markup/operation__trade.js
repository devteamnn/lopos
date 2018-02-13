import stor from './../tools/storage.js';

const createButton = (id, value, clickCallback) => {
  let type = (value === '+1') ? 'add' : 'card';
  let button = document.createElement('button');

  button.type = 'button';
  button.className = 'btn btn-danger';
  button.innerHTML = value;
  button.dataset['id'] = id;
  button.dataset['type'] = type;

  button.addEventListener('click', (evt) => {
    stor.currentGoodId = evt.target.dataset['id'];
    clickCallback(evt.target.dataset['type']);
  });

  return button;
};

export default {
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
    container.innerHTML = '';

    goods.forEach((good, index) => {
      let div = document.createElement('div');
      div.className = 'goods-string';
      div.innerHTML = `
        <div>
          <span class="reference-row-number">${index + 1}</span>
          <span>${good.id}</span>
          <span>${good.name}</span>
        </div>`;
      let div2 = document.createElement('div');
      div2.innerHTML = `${(good.count) ? good.count : ''}`;
      div2.appendChild(createButton(good.id, '+1', clickCallback));
      div2.appendChild(createButton(good.id, 'i', clickCallback));

      div.appendChild(div2);

      container.appendChild(div);
    });
  }
};

