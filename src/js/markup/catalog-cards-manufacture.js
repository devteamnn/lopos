export default {

  getElement(item, index) {
    /*
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-card-id="${item.id}" data-card-index="${index}"">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span>
        <span>${item.name}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">${(item.k) ? item.k : ''}
      </div>
    </div>`;
    */
    return `
        <div class="manufacture-header" data-card-id="${item.id}" data-card-index="${index}">
            <div class="manufacture-3-column">${index + 1}</div>
            <div class="manufacture-3-column">${item.name}</div>
            <div class="manufacture-3-column">${item.k}</div>
        </div>`;
  },


  drawDataInContainer(cardsData, container) {
    container.innerHTML = `
      <div class="manufacture-header">
          <div class="manufacture-3-column">№</div>
          <div class="manufacture-3-column">Карточка товара</div>
          <div class="manufacture-3-column">Кол-во</div>
      </div>
    `;
    if (cardsData.length > 0) {
      cardsData.forEach((item, index) => container.insertAdjacentHTML('beforeend', this.getElement(item, index)));
    } else {
      container.innerHTML = 'Производственных карточек еще не создано';
    }
  },

  getResourceElement(item, number) {

    return `
    <div class="manufacture-header" data-card-id="${item.good_id}">
      <div class="manufacture-3-column">${number}</div>
      <div class="manufacture-3-column">${item.name}</div>
      <div class="manufacture-3-column">${item.value}</div>
    </div>
    `;
    /*
    return `
    <div class="d-flex justify-content-between reference-string" data-card-id="${item.good_id}"">
      <div style="padding-left: 34px;">
        ${item.name}
      </div>
      <div style="padding-right: 10px;">
        ${item.value}
      </div>
    </div>`;
    */

  },

};
