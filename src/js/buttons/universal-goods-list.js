import auth from '../tools/storage.js';

const markup = {
  getGoodString(item, index) {

    return `
      <div class="catalog-groups-header" data-good-id="${item.id}">
        <div class="catalog-groups-column">${index + 1}</div>
        <div class="catalog-groups-column">${item.name}</div>
        <div class="catalog-groups-column">${(Number(item.count)) ? Number(item.count).toFixed(2) : ''}</div>
        <div class="catalog-groups-column"><button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button></div>
      </div>`;
  },

  getGoodStringSearch(item, index) {

    return `
      <div class="catalog-groups-header" data-good-id="${item.id}">
        <div class="catalog-groups-column">${index + 1}</div>
        <div class="catalog-groups-column">${item.name}</div>

      </div>`;
  },

  getGoodTile(item, index) {

    const getImg = (imgUrl) => (imgUrl) ? `https://lopos.bidone.ru/users/600a5357/images/${imgUrl}_preview150.jpg` : './img/not-available.png';

    return `
    <div class="card goods-tile-card" data-good-id="${item.id}">
      <img class="card-img-top" src="${getImg(item.img_url)}" alt="${item.name}" title="${item.name}">
      <div class="card-body ${(Number(item.count)) ? 'goods-tile-title' : ''}">
        <p class="card-text">${(Number(item.count)) ? Number(item.count).toFixed(2) : ''}</p>
      </div>
    </div>`;
  },

  drawGoodsTable(goodsData, container, handler) {
    container.innerHTML = `
      <div class="catalog-groups-header">
        <div class="catalog-groups-column">№</div>
        <div class="catalog-groups-column">Товар</div>
        <div class="catalog-groups-column">Количество</div>
        <div class="catalog-groups-column">Ред.</div>
      </div>
    `;
    if (goodsData) {
      goodsData.forEach((good, index) => {
        container.insertAdjacentHTML('beforeend', this.getGoodString(good, index));
        container.lastChild.addEventListener('click', function () {
          auth.currentGoodId = good.id;
          handler(good);
        });
      });
    } else {
      container.innerHTML = 'Пусто';
    }
  },

  drawGoodsSearch(goodsData, container, handler) {
    container.innerHTML = `
      <div class="catalog-groups-header">
        <div class="catalog-groups-column">№</div>
        <div class="catalog-groups-column">Товар</div>
      </div>
    `;
    if (goodsData) {
      goodsData.forEach((good, index) => {
        container.insertAdjacentHTML('beforeend', this.getGoodStringSearch(good, index));
        container.lastChild.addEventListener('click', function () {
          auth.currentGoodId = good.id;
          handler(good);
        });
      });
    } else {
      container.innerHTML = 'Пусто';
    }
  },

  drawGoodsMetro(goodsData, container, handler) {
    if (goodsData) {
      container.innerHTML = '<div class="goods-tile"></div>';
      goodsData.forEach((good, index) => {
        container.firstChild.insertAdjacentHTML('beforeend', this.getGoodTile(good, index));
        container.firstChild.lastChild.addEventListener('click', function () {
          auth.currentGoodId = good.id;
          handler(good);
        });
      });
    } else {
      container.innerHTML = 'Пусто';
    }
  }
};

// отрисовка списка товаров по данным
const drawGoods = (goodsList, container, handler, viewFlag) => {
  console.log(goodsList);
  if (viewFlag === 'search') {
    markup.drawGoodsSearch(goodsList, container, handler);
  } else if (auth.goodsViewMode === 'string' || viewFlag === 'string') {
    markup.drawGoodsTable(goodsList, container, handler);
  } else if (auth.goodsViewMode === 'metro') {
    markup.drawGoodsMetro(goodsList, container, handler);
  }
};

export default {
  draw: drawGoods
};
