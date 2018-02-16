import xhr from './../tools/xhr.js';
import stor from './../tools/storage.js';

const getGoods = (groupId, stock, callback) => {

  const getGoodsXhrCallbackSuccess = (response) => {
    callback(response.data);
  };


  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;

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

  let oper = 'purchase'; // Здесь выбор купля\продажа
  let cred = stor.data;

  xhr.request = {
    'url': `/lopos_directory/${cred.directory}/operator/${cred.operatorId}/business/${cred.currentBusiness}/operation/${oper}`,
    'metod': 'POST',
    'data': `token=${cred.token}`,
    'callbackSuccess': getDataXhrCallbackSuccess
  };
};

export default {
  getDataFromServer: getData,
  getGoodsFromServer: getGoods
};
