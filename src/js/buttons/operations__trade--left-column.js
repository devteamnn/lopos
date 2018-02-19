// import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import universalGroupsList from './universal-groups-list.js';
import markup from './../markup/operation__trade.js';

let leftColumn = document.querySelector('#operations-trade-left');
let elHeader = document.querySelector('#operations-trade-left-header');
// const stocksList = document.querySelector('#operations-purchase-stocks-list');

const NodeEnum = {
  IMG_GROUP: '<img src="img/groups.png" alt="">',
  BUT_BACK: '<button id="operation-trade-left-column-return-btn" type="button" class="btn btn-success p-0 icon-btn icon-btn__return"></button>'
};

const getHeader = (type, handler) => {
  let confHead = {};

  switch (type) {
  case 'groups':
    confHead.node = NodeEnum.IMG_GROUP;
    confHead.header = 'Группы товаров';
    break;
  case 'goods':
    confHead.node = NodeEnum.BUT_BACK;
    confHead.header = stor.currentGroupName;
    break;
  }
  elHeader.innerHTML = markup.leftColumnHeader(confHead.header, confHead.node);

  if (type !== 'groups') {
    document.querySelector('#operation-trade-left-column-return-btn').addEventListener('click', handler);
  }

};

const getGroups = (groups, groupClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'folder';
  getHeader('groups', btnBackHandler);
  universalGroupsList.draw(groups, leftColumn, groupClickHandler);
};

const getGoods = (goods, goodClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'goods';
  getHeader('goods', btnBackHandler);
  markup.leftColumnGoods(goods, leftColumn, goodClickHandler);

};

export default {

  drawHeader: getHeader,
  drawGroups: getGroups,
  drawGoods: getGoods
};
