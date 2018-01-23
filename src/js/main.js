import auth from './tools/storage.js';
import mainWindow from './login/main_login_window.js';
import logButton from './buttons/log.js';
import profileButton from './buttons/online-profile.js';
import enterprisesButton from './buttons/reference-enterprises.js';
import enterprisesButtonFormAdd from './buttons/reference-enterprises-add.js';
import enterprisesButtonFormEdit from './buttons/reference-enterprises-edit.js';
import pointsButton from './buttons/reference-points.js';
import pointsButtonFormAdd from './buttons/reference-points-add.js';
import pointsButtonFormEdit from './buttons/reference-points-edit.js';
import contractorsButton from './buttons/reference-contractors.js';
import contractorsButtonFormAdd from './buttons/reference-contractors-add.js';
import keywordsButton from './buttons/reference-keywords.js';
import keywordsButtonAdd from './buttons/reference-keywords-add.js';
import keywordsButtonEdit from './buttons/reference-keywords-edit.js';
import groupsButton from './buttons/catalog-groups.js';
import groupsButtonFormAdd from './buttons/catalog-groups-add.js';
import groupsButtonFormEdit from './buttons/catalog-groups-edit.js';

console.log('ver: 3D1');
console.log('ver: 2A5');

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
    groupsButtonFormAdd.start();
    groupsButtonFormEdit.start();
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
