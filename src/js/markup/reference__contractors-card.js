const listContractorsCardBody = document.querySelector('#list-contractors-card-body');
/*
const BillTypes = {
  'type0': 'suppliers',
  'type1': 'admission',
  'type2': 'buyers',
  'type3': 'sale',
  'type8': 'ic_my_production',
};
*/
export default {

  cleanContainer() {
    listContractorsCardBody.innerHTML = '';
  },

  getElement(item) {
    let hasMinusInComments = item.total.includes('-');
    let imgName = 'expenses';

    if (hasMinusInComments) {
      imgName = 'admission';
    } else {
      imgName = 'sale';
    }

    return `
     <div class="reference-header" data-link="${item.id}" data-naklad=${item.id}  >
      <div class="reference-column-3">
        
      </div>
      <div class="reference-column">

      <div class="online-user">
        <img class="mr-3" src="img/${imgName}.png" width="30" alt="Generic placeholder image">
        <b>${item.total}</b>
      </div>


      </div>
      <div class="reference-column">
          <div >${new Date(+(item.time_activity + '000')).toLocaleString()}</div>
      </div>
      <div class="reference-column">
          <div><img src="img/icons8-preview.png"></div>
      </div>
    </div>
`;

  },

  drawDataInContainer(buyersCardData) {
    console.log(buyersCardData);
    if (buyersCardData) {
      listContractorsCardBody.innerHTML = `
        <div class="reference-header">
            <div class="reference-column-3"></div>
            <div class="reference-column">Операция</div>
            <div class="reference-column">Время</div>
            <div class="reference-column">Просм.</div>
        </div>`;
      buyersCardData.forEach((item) => listContractorsCardBody.insertAdjacentHTML('beforeend', this.getElement(item)));
    } else {
      listContractorsCardBody.insertAdjacentHTML('beforeend', '<p class="border">Накладных нет</p>');

    }
  },

  drawMarkupInContainer(markup) {
    listContractorsCardBody.insertAdjacentHTML('beforeend', markup);
  },

};
