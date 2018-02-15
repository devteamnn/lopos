import stor from './../tools/storage.js';

const nodeGoodCount = document.querySelector('#operations-trade-add-count');
const nodeGoodName = document.querySelector('#operations-trade-add-name');
const nodeInput = document.querySelector('operations-trade-add-input');
const nodeSubmit = document.querySelector('operations-trade-add-input');

export default {
  show() {
    nodeGoodName.innerHTML = stor.operationTradeCurrentGoodName;
    nodeGoodCount.innerHTML = stor.operationTradeCurrentGoodCount;
    $('#operations-trade-add').modal('show');
  }
};
