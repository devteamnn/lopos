const listPointsBody = document.querySelector('#list-points-body');
import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listPointsBody.innerHTML = '';
  },

  getElement(item, index) {
    const currentStockFlag = (item.id === auth.data['currentStock']) ? '<div class="p-0 bg-white icon icon__check" style="width: 28px; height: 28px;"></div>' : '';

    /*
    return `

    <input type="radio" id="${item.id}" data-stock-id="${item.id}" name="contact" value="email" class="d-none">

    <label style="padding-left: 34px;" for="${item.id}"  class="d-flex justify-content-between align-items-center reference-string" data-stock-id="${item.id}" data-stock-name="${item.name}">
      <div><span class="reference-row-number">${index + 1}</span> ${item.name}</div>
      <div class="d-flex justify-content-between align-items-center">
        ${currentStockFlag}
      </div>
      </label>`;

    */
    return `
    <input type="radio" id="${item.id}" data-stock-id="${item.id}" name="contact" value="email" class="d-none">

    <label class="reference-header" for="${item.id}" data-stock-id="${item.id}" data-stock-name="${item.name}">
        <div class="reference-column">${index + 1}</div>
        <div class="reference-column">${item.name}${currentStockFlag}</div>
    </label>
`;


  },

  drawDataInContainer(enterprisesData) {
    listPointsBody.innerHTML = `
    <div class="reference-header">
        <div class="reference-column">№</div>
        <div class="reference-column">Точка</div>
    </div>
    `;
    enterprisesData.forEach((item, index) => listPointsBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  drawMarkupInContainer(markup) {
    listPointsBody.insertAdjacentHTML('beforeend', markup);
  },

};
