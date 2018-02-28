import auth from '../tools/storage.js';

const markup = {
  getGoodString(item, index) {
    return `
    <div class="goods-string" data-good-id="${item.id}">
      <div>
        <span class="reference-row-number">${index + 1}</span> <span>${item.name}</span>
      </div>
      <div>
        ${(Number(item.count)) ? Number(item.count).toFixed(2) : ''}
        <button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button>
      </div>
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
    container.innerHTML = '';
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
  if (auth.goodsViewMode === 'string' || viewFlag === 'string') {
    console.log('hihihi');
    markup.drawGoodsTable(goodsList, container, handler);
  } else if (auth.goodsViewMode === 'metro') {
    markup.drawGoodsMetro(goodsList, container, handler);
  }
};

export default {
  draw: drawGoods
};
