export default {

  getElement(item, index) {

    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-card-id="${item.id}" data-card-index="${index}"">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span>
        <span>${item.name}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">${(item.k) ? item.k : ''}
      </div>
    </div>`;
  },


  drawDataInContainer(cardsData, container) {
    if (cardsData.length > 0) {
      cardsData.forEach((item, index) => container.insertAdjacentHTML('beforeend', this.getElement(item, index)));
    } else {
      container.innerHTML = 'Производственных карточек еще не создано';
    }
  },

  getResourceElement(item) {
    return `
    <div class="d-flex justify-content-between reference-string" data-card-id="${item.good_id}"">
      <div style="padding-left: 34px;">
        ${item.name}
      </div>
      <div style="padding-right: 10px;">
        ${item.value}
      </div>

    </div>`;
  },

};
