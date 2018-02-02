const listCardsBody = document.querySelector('#list-cards-card-body');
// import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listCardsBody.innerHTML = '';
  },

  getElement(item, index) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}

    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-card-id="${item.id}" data-card-index="${index}"">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span> ||
        <span>${item.name}</span> ||
        <span>${item.id}</span> ||
      </div>
      <div class="d-flex justify-content-between align-items-center">
      </div>
    </div>`;
  },


  drawDataInContainer(cardsData) {
    cardsData.forEach((item, index) => listCardsBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  getResourceElement(item) {
    // const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';
    // ${currentEnterpriseFlag}

    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-card-id="${item.good_id}"">
      <div style="padding-left: 34px;">
        <span>${item.good_id}</span> ||
        <span>${item.name}</span> ||
        <span>${item.value}</span> ||
      </div>
      <div class="d-flex justify-content-between align-items-center">
      </div>
    </div>`;
  },

  drawMarkupInContainer(markup) {
    listCardsBody.insertAdjacentHTML('beforeend', markup);
  },

};
