const listEnterprisesBody = document.querySelector('#list-enterprises-body');
import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listEnterprisesBody.innerHTML = '';
  },

  getElement(item, index) {
    const currentEnterpriseFlag = (item.b_id === auth.data['currentBusiness']) ? '<div class="p-0 bg-white icon icon__check" style="width: 28px; height: 28px;"></div>' : '';
/*
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-enterprise-id="${item.b_id}">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span> <span>${item.b_name}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        ${currentEnterpriseFlag}

        <button type="button" class="btn p-0 bg-white icon-btn icon-btn__go"></button>
      </div>
    </div>`;
  },
  */
    return `

        <div class="reference-header" data-enterprise-id="${item.b_id}">
            <div class="reference-column">${index + 1}</div>
            <div class="reference-column">${item.b_name}${currentEnterpriseFlag}</div>
        </div>`;
  },

  drawDataInContainer(enterprisesData) {
    listEnterprisesBody.innerHTML = `
      <div class="reference-header">
          <div class="reference-column">№</div>
          <div class="reference-column">Предприятие</div>
      </div>
    `;
    enterprisesData.forEach((item, index) => listEnterprisesBody.insertAdjacentHTML('beforeend', this.getElement(item, index)));
  },

  drawMarkupInContainer(markup) {
    listEnterprisesBody.insertAdjacentHTML('beforeend', markup);
  },

};
