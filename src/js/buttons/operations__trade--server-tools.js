import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';

const getGoods = (groupId, stock, callback) => {

  const getGoodsXhrCallbackSuccess = (response) => {
    response.data.forEach((evt) => {
      evt.price = Number(evt.price).toFixed(2);
    });
    callback(response.data);
  };


  let oper;
  let cred = stor.data;

  switch (stor.operationTradeType) {
  case '0':
    oper = 'purchase';
    break;
  case '1':
    oper = 'sell';
    break;
  case '7':
    oper = 'inventory';
    break;
  }

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/stock/${stock}/group/${groupId}/goods`,
    'metod': 'POST',
    'data': `operation=${oper}&token=${cred.token}`,
    'callbackSuccess': getGoodsXhrCallbackSuccess
  };
};


const getData = (stock, callback) => {

  const getDataXhrCallbackSuccess = (response) => {
    callback(response.data);
  };

  let cred = stor.data;
  let oper;
  let xhrData;

  switch (stor.operationTradeType) {
  case '0':
    oper = 'purchase';
    xhrData = `token=${cred.token}`;
    break;
  case '1':
    oper = 'sell  ';
    xhrData = `token=${cred.token}`;
    break;
  case '7':
    oper = 'inventory';
    xhrData = `token=${cred.token}&stock=${stock}`;
    break;
  }

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/operation/${oper}`,
    'metod': 'POST',
    'data': xhrData,
    'callbackSuccess': getDataXhrCallbackSuccess
  };
};

// data = {
//   stock
//   kontragent
//   delivery
//   data
// }
const sendData = (data, callback) => {

  const getDataXhrCallbackSuccess = (response) => {
    console.log('SEND OK');
    console.dir(response);
    // callback(response.data);
  };

  let cred = stor.data;
  let goodData = [];

  data.data.forEach((el) => {
    goodData.push({
      'value': el.count,
      'good': el.id,
      'price': el.price
    });
  });

  goodData = JSON.stringify(goodData);

  console.dir(goodData);

  let xhrData = `token=${cred.token}&kontr_agent=${data.kontragent}&type=${stor.operationTradeType}&delivery=${data.delivery}&content=${goodData}`;

  let xhrResp = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/stock/${data.stock}/temp_naklad_provesti`,
    'metod': 'POST',
    'data': xhrData,
    'callbackSuccess': getDataXhrCallbackSuccess
  };

  console.dir(xhrResp);

  xhr.request = xhrResp;
};

export default {
  getDataFromServer: getData,
  getGoodsFromServer: getGoods,
  sendDataToServer: sendData
};
