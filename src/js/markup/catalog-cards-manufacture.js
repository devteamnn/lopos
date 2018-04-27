export default {

  getElement(item, index) {
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
  },
};
