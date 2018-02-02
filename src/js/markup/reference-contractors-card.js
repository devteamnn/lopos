const listContractorsCardBody = document.querySelector('#list-contractors-card-body');
// import auth from '../tools/storage.js';

/*
const drawHeaderInContainer = (data) => {
  return `
    <div class="d-flex justify-content-between">
      <div class="border">${data.name}</div>
      <div class="border">${data.phone}</div>
      <div class="border">${data.email}</div>
    </div>
    <div class="d-flex border">${data.description}</div>
  `;
};
*/
/*
const drawHeaderInContainer = (data) => {
  return `
    <div class="d-flex justify-content-between">
      <div class="border">${auth.currentContractorName}</div>
    </div>
  `;
};
*/

const BillTypes = {
  'type0': 'suppliers',
  'type1': 'admission',
  'type2': 'buyers',
  'type3': 'sale',
  'type8': 'ic_my_production',
};

export default {

  cleanContainer() {
    listContractorsCardBody.innerHTML = '';
  },

  getElement(item) {
    // const currentStockFlag = (item.id === auth.data['currentStock']) ? 'V' : '';

    return `
    <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
      <div class="media">
        <img class="mr-3" src="img/${BillTypes['type' + item.type]}.png" width="30" alt="Generic placeholder image">
        <div class="media-body">
          <b>ID: </b>${item.id}
          <b> Статус: </b>${item.status}
          <b> Время: </b>${new Date(+(item.time_activity + '000')).toLocaleString()}
          <b> Всего: </b>${item.total}
          <b> Тип: </b>${item.type}
        </div>
      </div>`;
/*
    return `
        <div class="border">
          <b>ID: </b>${item.id}
          <b> Статус: </b>${item.status}
          <b> Время: </b>${new Date(+(item.time_activity + '000')).toLocaleString()}
          <b> Всего: </b>${item.total}
          <b> Тип: </b>${item.type}
        </div>
`;*/
  },

  drawDataInContainer(buyersCardData) {
    console.log(buyersCardData);
    // listContractorsCardBody.insertAdjacentHTML('beforeend', drawHeaderInContainer(buyersCardData));
    if (buyersCardData) {
      buyersCardData.forEach((item) => listContractorsCardBody.insertAdjacentHTML('beforeend', this.getElement(item)));
    } else {
      listContractorsCardBody.insertAdjacentHTML('beforeend', '<p class="border">Накладных нет</p>');

    }
  },

  drawMarkupInContainer(markup) {
    listContractorsCardBody.insertAdjacentHTML('beforeend', markup);
  },

};
