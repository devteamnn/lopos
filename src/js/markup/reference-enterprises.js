const listEnterprisesBody = document.querySelector('#list-enterprises-body');
import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listEnterprisesBody.innerHTML = '';
  },

  getElement(item, index) {
    const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check"></div>' : '';

    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-enterprise-id="${item.b_id}">
      <div style="padding-left: 34px;"><span class="reference-row-number">${index + 1}</span> <span>${item.b_name}</span></div>
      <div class="d-flex justify-content-between align-items-center">
        ${currentEnterpriseFlag}

        <button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button>
      </div>
    </div>`;
  },

  drawDataInContainer(enterprisesData) {
    enterprisesData.forEach((item, index) => listEnterprisesBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  drawMarkupInContainer(markup) {
    listEnterprisesBody.insertAdjacentHTML('beforeend', markup);
  },

};
