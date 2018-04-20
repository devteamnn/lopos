const listLogBody = document.querySelector('#log-body');
import docs from '../buttons/accounting__all-docs.js';
import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listLogBody.innerHTML = '';
  },

  getElement(item, index) {
    const getIconColor = (item.ha_operator_hex) ? item.ha_operator_hex : 'F4002C';
    let hasMinusInComments = item.ha_comment.includes('-');
    let imgName = '';

    if (item.ha_kontr_agent_id_fk) {
      imgName = 'buyers';
    }
    if (item.ha_nomenclature_card_id_fk) {
      imgName = 'ic_my_nomenclature';
    }
    if (item.ha_group_good_id_fk) {
      imgName = 'groups';
    }
    if (item.ha_good_id_fk || item.ha_price_id_fk) {
      imgName = 'goods';
    }
    if (item.ha_tag_id_fk) {
      imgName = 'ic_my_tag';
    }

    if (item.ha_balance_act_id_fk && hasMinusInComments) {
      imgName = 'expenses';
    } else if (item.ha_balance_act_id_fk && !hasMinusInComments) {
      imgName = 'revenue';
    }

    if (item.ha_naklad_id_fk && hasMinusInComments) {
      imgName = 'admission';
    } else if (item.ha_naklad_id_fk && !hasMinusInComments) {
      imgName = 'sale';
    }

    imgName = (imgName) ? imgName : 'other_ic_history';

    let cardHeader = item.ha_comment.split('\n');
    cardHeader[1] = (cardHeader[1]) ? cardHeader[1] : '';
    return `
    <div class="reference-header" data-link="${imgName}" ${(imgName === 'admission' || imgName === 'sale') ? `data-naklad=${item.ha_naklad_id_fk}` : ''} ${(imgName === 'expenses' || imgName === 'revenue') ? `data-balance=${item.ha_balance_act_id_fk}` : ''}>
      <div class="reference-column-3">
        <div style="background-color: #${getIconColor};   border-radius: 10px 10px 10px 10px;" width="60" >
          <img  src="img/user-male-filled-32.png" style="margin-left:1px; title="${item.ha_operator_name}"  width="24" height="24" alt="${item.ha_operator_name}">
          <span style="margin-right:2px; color:#ffffff;">${item.ha_operator_id}</span>
        </div>
      </div>
      <div class="reference-column">

      <div class="online-user">
        <img class="mr-3" src="img/${imgName}.png" width="30" alt="Generic placeholder image">
        <b>${cardHeader[0]}</b>
        ${cardHeader[1]}
      </div>


      </div>
      <div class="reference-column">
          <div >${new Date(+(item.ha_time + '000')).toLocaleString()}</div>
      </div>
      <div class="reference-column">
          <div>${(imgName === 'admission' || imgName === 'sale' || imgName === 'expenses' || imgName === 'revenue') ? '<img src="img/icons8-preview.png">' : ''}</div>
      </div>
    </div>`;

  },

  addCardToContainer(cardMarkupItem) {
    listLogBody.insertAdjacentHTML('beforeend', cardMarkupItem);
    if (listLogBody.lastChild.dataset.link === 'admission' || listLogBody.lastChild.dataset.link === 'sale') {
      let billId = listLogBody.lastChild.dataset.naklad;
      listLogBody.lastChild.addEventListener('click', () => {
        auth.currentBillId = billId;
        docs.onBillClick();
      });
    } else if (listLogBody.lastChild.dataset.link === 'expenses' || listLogBody.lastChild.dataset.link === 'revenue') {
      let billId = listLogBody.lastChild.dataset.balance;
      listLogBody.lastChild.addEventListener('click', () => {
        auth.currentBillId = billId;
        docs.onBalanceActClick();
      });
    }
  },

};
