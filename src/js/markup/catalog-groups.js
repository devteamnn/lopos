const listGroupsBody = document.querySelector('#list-groups-card-body');
const groupGoodsBody = document.querySelector('#group-goods-card-body');
// import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listGroupsBody.innerHTML = '';
  },

  getElement(item, index) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}
    console.log(item, index);
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-group-id="${item.id}" data-group-index="${index}" data-group-level="${item.level}">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span> ||
        <span>${item.name}</span> ||
        <span>${item.id}</span> ||
        <span>${item.level}</span> ||
      </div>
      <div class="d-flex justify-content-between align-items-center">
      </div>
    </div>`;
  },

  getGoodString(item, index) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}

    return `
    <div class="goods-string" data-good-id="${item.id}">
      <div>
        <span class="reference-row-number">${index + 1}</span> <span>${item.name}</span>
      </div>
      <div>
        ${(item.count) ? item.count : ''}
        <button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button>
      </div>
    </div>`;
  },

  getGoodTile(item, index) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}

    const getImg = (imgUrl) => {
      if (imgUrl) {
        return `https://lopos.bidone.ru/users/600a5357/images/${imgUrl}_preview150.jpg`;
      } else {
        return '../img/not-available.png';
      }
    };

    return `
    <div class="card goods-tile-card" data-good-id="${item.id}">
      <img class="card-img-top" src="${getImg(item.img_url)}" alt="${item.name}" title="${item.name}">
      <div class="card-body goods-tile-title">
        <p class="card-text">${item.count}</p>
      </div>
    </div>`;
  },

  drawDataInContainer(groupsData) {
    groupsData.forEach((item, index) => listGroupsBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  drawMarkupInContainer(markup) {
    listGroupsBody.insertAdjacentHTML('beforeend', markup);
  },

  drawGoodsTable(goodsData) {
    console.log(goodsData);
    console.log(typeof goodsData);
    groupGoodsBody.innerHTML = '';
    if (goodsData) {
      goodsData.forEach((item, index) => groupGoodsBody.insertAdjacentHTML('beforeend', this.getGoodString(item, index)));
    } else {
      groupGoodsBody.innerHTML = 'Пусто';

    }
  },

  drawGoodsMetro(goodsData) {
    if (goodsData) {
      groupGoodsBody.innerHTML = '<div class="goods-tile"></div>';
      goodsData.forEach((item, index) => groupGoodsBody.firstChild.insertAdjacentHTML('beforeend', this.getGoodTile(item, index)));
    } else {
      groupGoodsBody.innerHTML = 'Пусто';
    }
  }

};
