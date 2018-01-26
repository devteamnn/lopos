export default {

  // заполняем хранилище
  set data(loadedData) {
    localStorage.setItem('nickname', loadedData.nickname);
    localStorage.setItem('lastLogin', loadedData.lastLogin);
    localStorage.setItem('email', loadedData.email);
    localStorage.setItem('directory', loadedData.directory);
    localStorage.setItem('operatorId', loadedData.operator_id);
    localStorage.setItem('token', loadedData.token);
    localStorage.setItem('currentBusiness', loadedData.current_business);
    localStorage.setItem('currentStock', loadedData.current_stock);
  },

  // возвращаем данные
  get data() {
    return {
      nickname: localStorage.getItem('nickname'),
      lastLogin: localStorage.getItem('lastLogin'),
      directory: localStorage.getItem('directory'),
      email: localStorage.getItem('email'),
      operatorId: localStorage.getItem('operatorId'),
      token: localStorage.getItem('token'),
      currentBusiness: localStorage.getItem('currentBusiness'),
      currentStock: localStorage.getItem('currentStock'),
    };
  },

  set currentBusiness(id) {
    localStorage.setItem('currentBusiness', id);
  },

  set currentStock(id) {
    localStorage.setItem('currentStock', id);
  },

  get isSetFlag() {
    return Object.values(this.data).some((item) => item !== null);
  },

  // чистим хранилище
  clean() {
    localStorage.removeItem('nickname');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('directory');
    localStorage.removeItem('email');
    localStorage.removeItem('operatorId');
    localStorage.removeItem('token');
    localStorage.removeItem('currentBusiness');
    localStorage.removeItem('currentStock');
  },

  // ВСЯКОЕ ПРОЧЕЕ

  set currentEnterpriseId(id) {
    sessionStorage.setItem('currentEnterpriseId', id);
  },

  get currentEnterpriseId() {
    return sessionStorage.getItem('currentEnterpriseId');
  },

  set currentEnterpriseName(name) {
    sessionStorage.setItem('currentEnterpriseName', name);
  },

  get currentEnterpriseName() {
    return sessionStorage.getItem('currentEnterpriseName');
  },


  set currentStockId(id) {
    sessionStorage.setItem('currentStockId', id);
  },

  get currentStockId() {
    return sessionStorage.getItem('currentStockId');
  },

  set currentStockName(name) {
    sessionStorage.setItem('currentStockName', name);
  },

  get currentStockName() {
    return sessionStorage.getItem('currentStockName');
  },

  set currentContractorId(id) {
    sessionStorage.setItem('currentContractorId', id);
  },

  get currentContractorId() {
    return sessionStorage.getItem('currentContractorId');
  },

  set currentContractorType(type) {
    sessionStorage.setItem('currentContractorType', type);
  },

  get currentContractorType() {
    return sessionStorage.getItem('currentContractorType');
  },

  set currentContractorOperation(type) {
    sessionStorage.setItem('currentContractorOperation', type);
  },

  get currentContractorOperation() {
    return sessionStorage.getItem('currentContractorOperation');
  },


  set currentKeywordRgb(rgb) {
    sessionStorage.setItem('currentKeywordRgb', rgb);
  },

  get currentKeywordRgb() {
    return sessionStorage.getItem('currentKeywordRgb');
  },

  set currentKeywordId(id) {
    sessionStorage.setItem('currentKeywordId', id);
  },

  get currentKeywordId() {
    return sessionStorage.getItem('currentKeywordId');
  },

  set currentKeywordName(name) {
    sessionStorage.setItem('currentKeywordName', name);
  },

  get currentKeywordName() {
    return sessionStorage.getItem('currentKeywordName');
  },

  set goodsViewMode(mode) {
    sessionStorage.setItem('goodsViewMode', mode);
  },

  get goodsViewMode() {
    return sessionStorage.getItem('goodsViewMode');
  },

  set goodsSortMode(mode) {
    sessionStorage.setItem('goodsSortMode', mode);
  },

  get goodsSortMode() {
    return sessionStorage.getItem('goodsSortMode');
  },

  set currentGroupId(id) {
    sessionStorage.setItem('currentGroupId', id);
  },

  get currentGroupId() {
    return sessionStorage.getItem('currentGroupId');
  },

  set currentGroupName(name) {
    sessionStorage.setItem('currentGroupName', name);
  },

  get currentGroupName() {
    return sessionStorage.getItem('currentGroupName');
  },

  set currentGoodId(id) {
    sessionStorage.setItem('currentGoodId', id);
  },

  get currentGoodId() {
    return sessionStorage.getItem('currentGoodId');
  },

  set currentStockQuantityT2(quantity) {
    sessionStorage.setItem('currentStockQuantityT2', quantity);
  },

  get currentStockQuantityT2() {
    return sessionStorage.getItem('currentStockQuantityT2');
  },

  set expressOperationType(type) {
    sessionStorage.setItem('expressOperationType', type);
  },

  get expressOperationType() {
    return sessionStorage.getItem('expressOperationType');
  },

  set currentCardId(id) {
    sessionStorage.setItem('currentCardId', id);
  },

  get currentCardId() {
    return sessionStorage.getItem('currentCardId');
  },

  set currentCardName(name) {
    sessionStorage.setItem('currentCardName', name);
  },

  get currentCardName() {
    return sessionStorage.getItem('currentCardName');
  },

};
