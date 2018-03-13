const listContractorsBody = document.querySelector('#list-contractors-body');

export default {

  cleanContainer() {
    listContractorsBody.innerHTML = '';
  },

  getElement(item, index) {

    return `
        <div class="reference-header" data-buyer-id="${item.id}" data-index="${index}">
            <div class="reference-column">${item.id}</div>
            <div class="reference-column">${item.name}</div>
        </div>
`;
    /*
    return `

      <div class="d-flex justify-content-between align-items-center reference-string"  data-buyer-id="${item.id}"  data-index="${index}">
        <div style="padding-left: 34px;"><span class="reference-row-number">${index + 1}</span> <span>${item.name}</span></div>
        <div class="d-flex justify-content-between align-items-center">


        </div>
    </div>`;
    */
  },

  drawDataInContainer(buyersBodyData) {
    buyersBodyData.forEach((item, index) => listContractorsBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  drawMarkupInContainer(markup) {
    listContractorsBody.innerHTML = `

        <div class="reference-header">
            <div class="reference-column">№</div>
            <div class="reference-column">Имя</div>
        </div>
  `;
    listContractorsBody.insertAdjacentHTML('beforeend', markup);
  },

  getBuyersHeader() {
    return `
        <img src="img/buyers.png" alt="">
        <h2>ПОКУПАТЕЛИ</h2>`;
  },

  getSuppliersHeader() {
    return `
        <img src="img/suppliers.png" alt="">
        <h2>ПОСТАВЩИКИ</h2>`;
  },


};
