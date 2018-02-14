
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

    const clickHandler = (evt) => {
      switch (evt.target.dataset['type']) {
      case 'add':
        console.log('add');
        break;
      case 'card':
        console.log('card');
        break;
      default:
        console.log('def');
        break;
      }
    };

    container.innerHTML = '';


    // goods.forEach((good, index) => {
    //   let div = document.createElement('div');
    //   div.className = 'goods-string';
    //   div.dataset['id'] = good.id;
    //   div.innerHTML = `
    //     <div>
    //       <span class="reference-row-number">${index + 1}</span>
    //       <span>${good.id}</span>
    //       <span>${good.name}</span>
    //     </div>
    //     <div>
    //       <button class="button btn btn-danger" data-type="add">+1</button>
    //       <button class="button btn btn-danger" data-type="card">i</button>
    //     </div>
    //   `;

    //   div.addEventListener('click', clickHandler);

    //   fragment.appendChild(div);
    // });

    let table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = '<thead><tr><th scope="col" class="">#</th><th scope="col" class="w-50">Товар</th><th scope="col">Кол-во</th><th scope="col"></th><th scope="col"></th></tr></thead>';

    let tbody = document.createElement('tbody');

    goods.forEach((good, index) => {
      let tr = document.createElement('tr');
      tr.scope = 'row';
      tr.dataset['id'] = good.id;
      tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${good.name}</td>
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

  }
};
