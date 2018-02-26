// import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';
import universalGroupsList from './universal-groups-list.js';
import markup from './../markup/operation__trade.js';

let leftTradeColumn = document.querySelector('#operations-trade-left');
let leftInventoryColumn = document.querySelector('#operation-inventory-left');
let coolTradeHeader = document.querySelector('#operations-trade-left-header');
let coolInventoryHeader = document.querySelector('#operation-inventory-left-header');
// const stocksList = document.querySelector('#operations-purchase-stocks-list');

const NodeEnum = {
  IMG_GROUP: '<img src="img/groups.png" alt="">',
  BUT_BACK: '<button id="operation-left-column-return-btn" type="button" class="btn btn-success p-0 icon-btn icon-btn__return"></button>'
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

  let cool = (stor.operationTradeType === '7') ? coolInventoryHeader : coolTradeHeader;

  cool.innerHTML = markup.leftColumnHeader(confHead.header, confHead.node);

  if (type !== 'groups') {
    cool.querySelector('#operation-left-column-return-btn').addEventListener('click', handler);
  }

};

const getTradeGoods = (goods, clickCallback) => {

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

  leftTradeColumn.innerHTML = '';

  let table = document.createElement('table');
  table.className = 'table table-hover';
  table.innerHTML = markup.leftColumnGoodsHeaderTrade();

  let tbody = document.createElement('tbody');

  goods.forEach((good, index) => {
    // let count = (good.count || good.count === 0) ? good.count : '';
    let count = (Number(good.count)) ? good.count : '';

    let tr = document.createElement('tr');
    tr.scope = 'row';
    tr.dataset['id'] = good.id;
    tr.dataset['name'] = good.name;
    tr.dataset['count'] = count;
    tr.dataset['price'] = good.price;
    tr.innerHTML = markup.leftColumnGoodsRowTrade(index, good.id, good.name, good.price, count);

    tr.addEventListener('click', clickHandler);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  leftTradeColumn.appendChild(table);
};

const getInventoryGoods = (goods, clickCallback) => {

  const clickHandler = (evt) => {
    let el = evt.target;

    while (!el.dataset['id']) {
      el = el.parentNode;
    }

    switch (evt.target.dataset['type']) {
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

    clickCallback();
  };

  leftInventoryColumn.innerHTML = '';

  let table = document.createElement('table');
  table.className = 'table table-hover';
  table.innerHTML = markup.leftColumnGoodsHeaderInventory();

  let tbody = document.createElement('tbody');

  goods.forEach((good, index) => {
    // let count = (good.count || good.count === 0) ? good.count : '';
    let count = (Number(good.count)) ? good.count : '';

    let tr = document.createElement('tr');
    tr.scope = 'row';
    tr.dataset['id'] = good.id;
    tr.dataset['name'] = good.name;
    tr.dataset['count'] = count;
    tr.dataset['price'] = good.price;
    tr.innerHTML = markup.leftColumnGoodsRowInventory(index, good.id, good.name, good.price, count);

    tr.addEventListener('click', clickHandler);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  leftInventoryColumn.appendChild(table);
};

const drawGroupsToColumt = (groups, groupClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'groups';
  stor.operationTradeIsFind = false;
  getHeader('groups', btnBackHandler);

  let leftColumn = (stor.operationTradeType === '7') ? leftInventoryColumn : leftTradeColumn;

  universalGroupsList.draw(groups, leftColumn, groupClickHandler);
};

const drawGoodsToColumn = (goods, goodClickHandler, btnBackHandler) => {
  stor.operationTradeCurrentOpen = 'goods';
  stor.operationTradeIsFind = false;
  getHeader('goods', btnBackHandler);

  if (stor.operationTradeType === '7') {
    getInventoryGoods(goods, goodClickHandler);
  } else {
    getTradeGoods(goods, goodClickHandler);
  }
};

const drawFindWindow = (goods, ClickHandler, btnBackHandler, type) => {
  stor.operationTradeIsFind = true;
  getHeader('find', btnBackHandler);

  switch (type) {
  case 'goods':

    if (stor.operationTradeType === '7') {
      getInventoryGoods(goods, ClickHandler);
    } else {
      getTradeGoods(goods, ClickHandler);
    }

    break;
  case 'groups':
    let leftColumn = (stor.operationTradeType === '7') ? leftInventoryColumn : leftTradeColumn;
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
    let leftColumn = (stor.operationTradeType === '7') ? leftInventoryColumn : leftTradeColumn;
    leftColumn.innerHTML = mess;
  }
};
