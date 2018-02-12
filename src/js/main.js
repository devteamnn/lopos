import auth from './tools/storage.js';
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


// import goodsButtonFormEdit from './buttons/catalog__goods--edit.js';
import cardsButton from './buttons/catalog__cards.js';
import searchButton from './buttons/catalog__search.js';

import operationsPurchase from './buttons/operations__purchase.js';

// Отправка без валидации
// import cardsResourcesButton from './buttons/catalog__cards--add-resource.js';

console.log('3D3 (07.02.18_13:30)');
console.log('ver: 3A5');

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
  operationsPurchase
];

// ========== ОБНОВЛЕНИЕ/ОТКРЫТИЕ СТРАНИЦЫ ==========
const start = () => {
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

  } else {
    showLoginHideApp();
    mainWindow.init();
  }
};

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
