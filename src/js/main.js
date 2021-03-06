import auth from './tools/storage.js';
import permissions from './tools/permissions.js';
import mainWindow from './login/main_login_window.js';
import logButton from './buttons/log.js';
import profileButton from './buttons/online__profile.js';
import enterprisesButton from './buttons/reference__enterprises.js';
import enterprisesButtonFormAdd from './buttons/reference__enterprises--add.js';
import enterprisesButtonFormEdit from './buttons/reference__enterprises--edit.js';
import pointsButton from './buttons/reference__points.js';
import pointsButtonFormAdd from './buttons/reference__points--add.js';
import pointsButtonFormEdit from './buttons/reference__points--edit.js';
import contractorsButton from './buttons/reference__contractors.js';
import contractorsButtonFormAdd from './buttons/reference__contractors--add.js';
import keywordsButton from './buttons/reference__keywords.js';
import keywordsButtonAdd from './buttons/reference__keywords--add.js';
import keywordsButtonEdit from './buttons/reference__keywords--edit.js';
import groupsButton from './buttons/catalog__groups.js';
import debitCreditButton from './buttons/reference__debit-credit.js';
import manufactureButton from './buttons/operations__manufacture.js';
import balanceButton from './buttons/operations__balance.js';
import usersButton from './buttons/online__users.js';
import docsButton from './buttons/accounting__all-docs.js';
import reportsButton from './buttons/accounting__reports.js';


// import goodsButtonFormEdit from './buttons/catalog__goods--edit.js';

import cardsButton from './buttons/catalog__cards.js';
import searchButton from './buttons/catalog__search.js';
import operationPurchase from './buttons/operations__purchase.js';
import operationSale from './buttons/operations__sale.js';
import operationInventory from './buttons/operations__inventory.js';

// import xhr from './tools/xhr.js';

// Отправка без валидации
// import cardsResourcesButton from './buttons/catalog__cards--add-resource.js';

console.log('3D3 (07.02.18_13:30)');
console.log('ver: 4А1');

const exit = document.querySelector('#profile-exit');
const app = document.querySelector('#app');
const login = document.querySelector('#login');

const showLoginHideApp = () => {
  login.classList.remove('d-none');
  app.classList.add('d-none');
};

const showAppHideLogin = () => {
  login.classList.add('d-none');
  app.classList.remove('d-none');
};

// чистим меню и вкладки
const initMarkup = () => {
  document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
  document.querySelectorAll('.nav-item.dropdown').forEach((item) => item.classList.remove('show'));
  document.querySelectorAll('.tab-pane').forEach((item) => item.classList.add('fade'));
  document.querySelectorAll('.dropdown-item').forEach((item) => item.classList.remove('active'));
};

const hashObserver = () => {
  let hash = window.location.hash;
  if (hash) {
    document.querySelector(`${hash}-list`).dispatchEvent(new Event('click'));
    document.querySelector(`${hash}-list`).classList.add('active');
    document.querySelector(`${hash}`).classList.add('active');
    document.querySelector(`${hash}`).classList.remove('fade');
  }
};

const mainMenuButtons = [
  profileButton,
  logButton,
  enterprisesButton,
  pointsButton,
  contractorsButton,
  keywordsButton,
  groupsButton,
  cardsButton,
  // cardsResourcesButton,
  searchButton,
  debitCreditButton,
  manufactureButton,
  balanceButton,
  usersButton,
  docsButton,
  reportsButton
];

// ========== ОБНОВЛЕНИЕ/ОТКРЫТИЕ СТРАНИЦЫ ==========
const start = () => {
  auth.goodsViewMode = 'string';
  if (auth.isSetFlag) {
    showAppHideLogin();
    initMarkup();
    hashObserver();
    mainMenuButtons.forEach((item) => item.start());
    enterprisesButtonFormAdd.start();
    enterprisesButtonFormEdit.start();
    pointsButtonFormAdd.start();
    pointsButtonFormEdit.start();
    contractorsButtonFormAdd.start();
    keywordsButtonAdd.start();
    keywordsButtonEdit.start();

    operationPurchase.start();
    operationSale.start();
    operationInventory.start();

    permissions.read();

  } else {
    showLoginHideApp();
    mainWindow.init();
  }
};

// ========== ВЫХОД ==========
const wideScreenBtn = document.querySelector('#widescreen-mode-btn');

const onWideScreenBtnClick = () => {
  const screenWidth = document.body.clientWidth;
  if (!wideScreenBtn.classList.contains('icon-btn__widescreen--active') && screenWidth > 1300) {
    wideScreenBtn.classList.add('icon-btn__widescreen--active');
    app.style.maxWidth = (screenWidth - 50) + 'px';
  } else if (wideScreenBtn.classList.contains('icon-btn__widescreen--active') && screenWidth > 1300) {
    app.style.maxWidth = '1140px';
    console.log(document.body.clientWidth);
    wideScreenBtn.classList.remove('icon-btn__widescreen--active');
  }
  console.log((wideScreenBtn.classList.contains('icon-btn__widescreen--active') && screenWidth > 1300));
};

wideScreenBtn.addEventListener('click', onWideScreenBtnClick);
// ==========  ==========

// ========== ВЫХОД ==========
const stop = () => {
  showLoginHideApp();
  auth.clean();
  mainMenuButtons.forEach((item) => item.stop());
  window.location.hash = '';
  document.dispatchEvent(new Event('logoutSuccess'));
};

// ========== НАЧАЛО РАБОТЫ ==========
initMarkup();
hashObserver();
start();
document.addEventListener('loginSuccess', start);
document.addEventListener('authError', stop);

// ========== ЗАВЕРШЕНИЕ РАБОТЫ ==========
exit.addEventListener('click', stop);
