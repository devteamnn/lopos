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
  case 'find':
    confHead.node = NodeEnum.BUT_BACK;
    confHead.header = 'Найдено:';
    break;
  }

  elHeader.innerHTML = markup.leftColumnHeader(confHead.header, confHead.node);

  if (type !== 'groups') {
    document.querySelector('#operation-trade-left-column-return-btn').addEventListener('click', handler);
  }

};

const getGoods = (goods, clickCallback) => {

  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    switch (evt.target.dataset['type']) {
    case 'add':
      stor.operationClickType = 'add';
      break;
    case 'card':
      stor.operationClickType = 'card';
      break;
    default:
      stor.operationClickType = 'def';
      break;
    }
    stor.operationTradeCurrentGoodId = el.dataset['id'];
    stor.operationTradeCurrentGoodName = el.dataset['name'];
    stor.operationTradeCurrentGoodCount = el.dataset['count'];
    stor.operationTradeCurrentGoodPrice = el.dataset['price'];

    clickCallback();
  };

  leftColumn.innerHTML = '';

  let table = document.createElement('table');
  table.className = 'table table-hover';
  table.innerHTML = markup.leftColumnGoodsHeader();

  let tbody = document.createElement('tbody');

  goods.forEach((good, index) => {
    let count = (good.count || good.count === 0) ? good.count : '';

    let tr = document.createElement('tr');
    tr.scope = 'row';
    tr.dataset['id'] = good.id;
    tr.dataset['name'] = good.name;
    tr.dataset['count'] = count;
    tr.dataset['price'] = good.price;
    tr.innerHTML = markup.leftColumnGoodsRow(index, good.id, good.name, good.price, count);

    tr.addEventListener('click', clickHandler);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  leftColumn.appendChild(table);
};

const drawGroupsToColumt = (groups, groupClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'groups';
  stor.operationTradeIsFind = false;
  getHeader('groups', btnBackHandler);
  universalGroupsList.draw(groups, leftColumn, groupClickHandler);
};

const drawGoodsToColumn = (goods, goodClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'goods';
  stor.operationTradeIsFind = false;
  getHeader('goods', btnBackHandler);
  getGoods(goods, goodClickHandler);
};

const drawFindWindow = (goods, ClickHandler, btnBackHandler, type) => {
  stor.operationTradeIsFind = true;
  getHeader('find', btnBackHandler);

  switch (type) {
  case 'goods':
    getGoods(goods, ClickHandler);
    break;
  case 'groups':
    universalGroupsList.draw(goods, leftColumn, ClickHandler);
    break;
  }
};

export default {

  drawHeader: getHeader,
  drawGroups: drawGroupsToColumt,
  drawGoods: drawGoodsToColumn,
  drawFind: drawFindWindow,

  message(mess) {
    leftColumn.innerHTML = mess;
  }
};
