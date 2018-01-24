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

    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-group-id="${item.id}" data-group-index="${index}">
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
        ${item.count}
        <button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button>
      </div>
    </div>`;
  },

  getGoodTile(item, index) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}

    return `
    <div class="card goods-tile-card" data-good-id="${item.id}">
      <img class="card-img-top" src="./img/st_fon_selected.png" alt="${item.name}" title="${item.name}">
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
    goodsData.forEach((item, index) => groupGoodsBody.insertAdjacentHTML('beforeend', this.getGoodString(item, index)));
  },

  drawGoodsMetro(goodsData) {
    groupGoodsBody.innerHTML = '<div class="goods-tile"></div>';
    goodsData.forEach((item, index) => groupGoodsBody.firstChild.insertAdjacentHTML('beforeend', this.getGoodTile(item, index)));
  }

};
