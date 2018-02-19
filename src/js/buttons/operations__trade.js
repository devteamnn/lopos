import stor from './../tools/storage.js';
import operationsTradeServer from './operations__trade--server-tools.js';
import operationsTradeLeft from './operations__trade--left-column.js';
import operationsTradeRight from './operations__trade--right-column.js';
import operationsTradeHeader from './operations__trade--header.js';
import operationsTradeAdd from './operations__trade--good-add.js';
import operationsTradeDiscount from './operations__trade--discount.js';


// Операции: 0 - закупка, 1 - продажа, 7 инвентаризация
const stocksList = document.querySelector('#operations-purchase-stocks-list');
const submitNode = document.querySelector('#operations-trade-submit');
const kontragents = document.querySelector('#operations-purchase-kontragents-list');
const deliveryNode = document.querySelector('#operations-trade-delivery');

let dataStore = [];
let dataGoods = [];
let nomCard = []; // номенклатура

// если товар не найден - возврщает 'none'
const searchGoodById = (array, id) => {
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return i;
      }
    }
  }
  return 'none';
};

const redrawColumn = () => {
  switch (stor.operationTradeCurrentOpen) {
  case 'folder':
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
    break;
  case 'goods':
    operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
    break;
  }

  operationsTradeRight.drawPrice(calcNumSum());
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
};

const clickGroupsCallback = () => {
  operationsTradeServer.getGoodsFromServer(stor.currentGroupId, stocksList.value, getGoodsCallback);
};

const clichButtonBackCallback = () => {
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);
};

const clickRightGoodsCallback = () => {
  if (stor.operationTradeRightClickType !== 'false') {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  } else {
    operationsTradeAdd.show(addRightFormCallback, 'r');
  }
};

const discountCallback = (discValue) => {
  if (discValue === 0) {
    remDiscountFromNomCard();
  } else {
    addDiscountToNomCard(discValue);
  }
};

const addGoodToNomCard = (value) => {
  let goodId = stor.operationTradeCurrentGoodId;
  let goodIndex = searchGoodById(dataGoods, goodId);

  dataGoods[goodIndex].count -= value;

  nomCard = operationsTradeRight.getNomenklature();

  let numIndex = searchGoodById(nomCard, goodId);

  if (!nomCard) {
    nomCard = [];
    nomCard.push({
      'id': dataGoods[goodIndex].id,
      'name': dataGoods[goodIndex].name,
      'price': dataGoods[goodIndex].price,
      'count': value,
      'oldCount': dataGoods[goodIndex].count
    });
  } else if (numIndex === 'none') {
    nomCard.push({
      'id': dataGoods[goodIndex].id,
      'name': dataGoods[goodIndex].name,
      'price': dataGoods[goodIndex].price,
      'count': value,
      'oldCount': dataGoods[goodIndex].count
    });
  } else {
    nomCard[numIndex].count = Number(nomCard[numIndex].count) + value;
    nomCard[numIndex].oldCount = Number(nomCard[numIndex].oldCount) - value;
  }

  calcDiscount();
  redrawColumn();
  submitNode.disabled = false;
};

const addDiscountToNomCard = (precent) => {
  calcDiscount(precent);
  stor.operationTradeDiscount = precent;
  operationsTradeRight.drawPrice(calcNumSum());
  operationsTradeRight.drawGoods(nomCard, clickRightGoodsCallback);
};

// noDiscount = true, если нужно рассчитать без скидкискидку
const calcNumSum = (noDiscount) => {
  let numSum = 0;

  if (nomCard.length !== 0) {
    if (noDiscount) {
      nomCard.forEach((el) => {
        if (!el.discount) {
          numSum += el.price * el.count;
        }
      });
    } else {
      nomCard.forEach((el) => {
        numSum += el.price * el.count;
      });
    }
  }

  return numSum.toFixed(2);
};

const calcDiscount = (value) => {
  let indexFromNum = searchGoodById(nomCard, dataStore.discount_id);

  if (indexFromNum !== 'none' || value) {
    let numSum = calcNumSum(true);
    let precent = (value) ? value : nomCard[indexFromNum].discount;

    if (indexFromNum === 'none') {
      nomCard.push({
        'id': dataStore.discount_id,
        'name': 'СКИДКА',
        'price': Number(numSum / 100 * precent).toFixed(2),
        'count': -1,
        'discount': precent
      });
      console.dir(nomCard);
    } else {
      nomCard[indexFromNum].price = Number(numSum / 100 * precent).toFixed(2);
      nomCard[indexFromNum].discount = precent;
      console.dir(nomCard);
    }
  }
};

const remGoodFromNomCard = () => {
  let id = stor.operationTradeCurrentGoodId;
  let numIndex = searchGoodById(nomCard, id);
  let goodIndex = searchGoodById(dataGoods, id);

  dataGoods[goodIndex].count = Number(dataGoods[goodIndex].count) + Number(nomCard[numIndex].count);

  nomCard.splice(numIndex, 1);

  if ((nomCard.length === 0) || (nomCard.length === 1 && nomCard[0].discount)) {
    submitNode.disabled = true;
  }

  console.dir(nomCard);

  calcDiscount();
  redrawColumn();

};

const remDiscountFromNomCard = () => {

  let index = searchGoodById(nomCard, dataStore.discount_id);
  nomCard.splice(index, 1);

  calcDiscount();
  stor.operationTradeDiscount = 0;

  redrawColumn();

};

const addLeftFormCallback = (count) => {
  addGoodToNomCard(count);
};

const addRightFormCallback = (count) => {
  if (count !== 0) {
    addGoodToNomCard(count);
  } else {
    remGoodFromNomCard();
  }
};

const clickLeftGoodsCallback = () => {
  switch (stor.operationClickType) {
  case 'add':
    addGoodToNomCard(1);
    break;
  case 'card':
    console.log('-CARD-');
    break;
  case 'def':
    operationsTradeAdd.show(addLeftFormCallback, 'l');
    break;
  }
};

const correctAmount = (data) => {
  nomCard = operationsTradeRight.getNomenklature();

  if (nomCard) {
    let index;
    nomCard.forEach((el) => {
      index = searchGoodById(data, el.id);

      if (index !== 'none') {
        data[index].count -= el.count;
      }
    });
  }
  return data;
};

const getGoodsCallback = (data) => {
  dataGoods = correctAmount(data);
  operationsTradeLeft.drawGoods(dataGoods, clickLeftGoodsCallback, clichButtonBackCallback);
};

const getDataCallback = (data) => {
  dataStore = data;
  console.dir(dataStore);
  operationsTradeHeader.setStocksList(dataStore.all_stocks);
  operationsTradeRight.setKontragentList(dataStore.all_kontr_agents);
  operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback);

};

const getData = () => {
  operationsTradeServer.getDataFromServer(stor.data.currentStock, getDataCallback);
};

const initWindow = () => {
  operationsTradeHeader.setHeader();
  operationsTradeRight.clear();
};

const init = (type) => {
  stor.operationTradeType = type;
  stor.operationTradeDiscount = 0;
  initWindow();
  getData();
};

const addHandlers = () => {

  document.querySelector('#list-receipt-list').addEventListener('click', () => {
    init(0);
  });

  document.querySelector('#list-sell-list').addEventListener('click', () => {
    init(1);
  });

  document.querySelector('#list-inventory-list').addEventListener('click', () => {
    init(7);
  });

  document.querySelector('#operations-trade-discountBtn').addEventListener('click', () => {
    operationsTradeDiscount.show(discountCallback, dataStore.discount_max);
  });

  document.querySelector('#operations-trade-clear-but').addEventListener('click', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });

  stocksList.addEventListener('change', () => {
    operationsTradeLeft.drawGroups(dataStore.all_groups, clickGroupsCallback, clichButtonBackCallback);
    operationsTradeRight.clear();
  });

  submitNode.addEventListener('click', () => {
    operationsTradeServer.sendDataToServer({
      'stock': stocksList.value,
      'kontragent': kontragents.value,
      'delivery': (deliveryNode.checked) ? 1 : 0,
      'data': nomCard
    });
  });
};

export default {
  start() {
    // !!Здесь инициализировать переменные и обработчики
    addHandlers();
  }
};
