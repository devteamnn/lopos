const listLogBody = document.querySelector('#log-body');

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
    <div id="log-row" class="card mb-0 p-1 rounded-0" style="width: 100%">
      <div class="media">
        <img class="mr-3 rounded-circle p-1" src="img/user-male-filled-32.png" title="${item.ha_operator_name}" style="background-color: #${getIconColor}" width="30" alt="${item.ha_operator_name}">
        <img class="mr-3" src="img/${imgName}.png" width="30" alt="Generic placeholder image">
        <div class="media-body">
          <b>${cardHeader[0]}</b>
          ${cardHeader[1]}
          <div class="badge text-right text-muted float-right">${new Date(+(item.ha_time + '000')).toLocaleString()}</div>
        </div>
      </div>`;
  },

  addCardToContainer(cardMarkupItem) {
    listLogBody.insertAdjacentHTML('beforeend', cardMarkupItem);
  },

};
