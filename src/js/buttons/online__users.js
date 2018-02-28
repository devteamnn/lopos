import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import uValid from './universal-validity-micro.js';
import toolsMarkup from '../markup/tools.js';
import permissionsModule from '../tools/permissions.js';

const usersList = document.querySelector('#list-users-list');
const usersHeader = document.querySelector('#list-users-header');
const usersBody = document.querySelector('#list-users-body');
const usersAddBtn = document.querySelector('#users-add');
const usersReturnBtn = document.querySelector('#user-card-return-btn');
const usersPasswordBtn = document.querySelector('#user-card-password-btn');
const usersEditBtn = document.querySelector('#user-card-edit-btn');
const usersLockBtn = document.querySelector('#user-card-lock-btn');

const userCard = document.querySelector('#user-card');
const userCardData = document.querySelector('#user-card-data');
const userProfileName = userCardData.querySelector('#user-profile-name');
const userProfileStatus = userCardData.querySelector('#user-profile-status');
const userProfileId = userCardData.querySelector('#user-profile-id');
const userProfileImage = userCardData.querySelector('#user-profile-image');
const userStockList = userCardData.querySelector('#user-stock-list');
const userStockPermissions = userCardData.querySelector('#user-stock-permissions');
const userOtherPermissions = userCardData.querySelector('#user-other-permissions');
const userRGBForm = document.querySelector('#user-card-edit-rgb');

const permissionsStock = {
  // операции
  'receipt': 111,
  'sell': 121,
  'inventory': 141,
  'balance': 131,
  'manufacture': 181
};

const permissionsOther = {

  // каталог
  'groups': [221, 222],
  'cards': [231, 232],

  // учет
  'docs': [321, 322],
  'reports': [331, 0],

  // справочники
  'contractor-suppliers': [411, 412],
  'contractor-buyers': [421, 422],
  'points': [431, 432],
  'keywords': [441, 442],
  'enterprises': [511, 512],
  'debit': [451, 452],
  'credit': [461, 462],

  // журнал
  'log': [541, '']
};

// ############################## РАЗМЕТКА ##############################
const markup = {

  getElement(item, index) {
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-user-id="${item.id}">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span>
        <img class="ml-2 mr-1 rounded-circle p-1" src="img/user-male-filled-32.png" title="${item.name}" style="background-color: #${item.color}" width="30" alt="${item.name}">
        <span>${item.name}</span>
      </div>
      <div class="user-status" style="background-color: #${(item.status === '0') ? 'dc3545' : '28a745'}"></div>
    </div>`;
  },

  drawDataInContainer(users, container, handler) {
    users.forEach((user, index) => {
      container.insertAdjacentHTML('beforeend', this.getElement(user, index));
      container.lastChild.addEventListener('click', function () {
        auth.currentUserId = user.id;
        handler();
      });
    });
  },
};

// отрисовка списка групп по данным
const drawUsers = (users, container, handler) => {
  container.innerHTML = '';
  if (users.length > 0) {
    markup.drawDataInContainer(users, container, handler);
  } else {
    container.innerHTML = 'Пользователей нет, все ушли на базу';
  }
};


// ############################## БЛОКИРОВКА ПОЛЬЗОВАТЕЛЯ #########################
const lockSuccess = (answer) => {
  userProfileStatus.innerText = (+userProfileStatus.innerText === 0) ? '1' : '0';
  console.log(answer);
};

const onUsersLockBtnClick = () => {
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}`,
    data: `status=${(+userProfileStatus.innerText === 0) ? '1' : '0'}&token=${auth.data.token}`,
    callbackSuccess: lockSuccess,
  };
};

usersLockBtn.addEventListener('click', onUsersLockBtnClick);
// ############################## ИЗМЕНЕНИЕ ИМЕНИ ПОЛЬЗОВАТЕЛЯ #########################
let editedName = '';
const editSuccess = (answer) => {
  userProfileName.innerText = editedName;
  console.log(answer);
};
const onUsersEditBtnClick = () => {
  toolsMarkup.runUniversalModalMicro = {
    title: 'Новое имя',
    inputLabel: 'Имя',
    inputPlaceholder: 'введите имя',
    inputValue: userProfileName.innerText,
    submitBtnName: 'Изменить',
    submitCallback() {
      if (uValid.check([document.querySelector('#universal-modal-micro-name')], ['change-user-name'])) {
        xhr.request = {
          metod: 'PUT',
          url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}`,
          data: `nickname=${document.querySelector('#universal-modal-micro-name').value}&token=${auth.data.token}`,
          callbackSuccess: editSuccess,
        };
        editedName = document.querySelector('#universal-modal-micro-name').value;
        $('#universal-modal-micro').modal('hide');
      }
    },
  };
};
usersEditBtn.addEventListener('click', onUsersEditBtnClick);
// ############################## ИЗМЕНЕНИЕ ПАРОЛЯ ПОЛЬЗОВАТЕЛЯ #########################
const changePassSuccess = (answer) => console.log(answer);
const onUsersPasswordBtnClick = () => {
  toolsMarkup.runUniversalModalMicro = {
    title: 'Новый пароль',
    inputLabel: 'Пароль',
    inputPlaceholder: 'введите пароль',
    submitBtnName: 'Изменить',
    submitCallback() {
      if (uValid.check([document.querySelector('#universal-modal-micro-name')], ['change-password'])) {
        xhr.request = {
          metod: 'PUT',
          url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}`,
          data: `password=${document.querySelector('#universal-modal-micro-name').value}&token=${auth.data.token}`,
          callbackSuccess: changePassSuccess,
        };
        $('#universal-modal-micro').modal('hide');
      }
    },
  };
};

usersPasswordBtn.addEventListener('click', onUsersPasswordBtnClick);
// ############################## ИЗМЕНЕНИЕ ЦВЕТА ПОЛЬЗОВАТЕЛЯ #########################
let editedRGB = '';
const updateColor = () => {
  userProfileImage.style.backgroundColor = '#' + editedRGB;
};

const onListKeywordsCardEditRGBFormSubmit = (evt) => {
  evt.preventDefault();
  console.log(userRGBForm.querySelector('input:checked'));
  let newRGB = userRGBForm.querySelector('input:checked').value;
  editedRGB = newRGB;
  // document.querySelector('#list-keywords-card-edit > h3').style.backgroundColor = '#' + auth.currentKeywordRgb;
  $(userRGBForm).modal('hide');

  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}`,
    data: `color=${newRGB}&token=${auth.data.token}`,
    callbackSuccess: updateColor,
  };

};

userRGBForm.addEventListener('submit', onListKeywordsCardEditRGBFormSubmit);
// ############################## ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ##############################

const addUser = () => {
  const onSuccessAddUser = (answer) => {
    console.log(answer);
    getUsers();
  };

  const setRequestToAddUser = () => {
    xhr.request = {
      metod: 'POST',
      url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}`,
      data: `token=${auth.data.token}`,
      callbackSuccess: onSuccessAddUser,
    };
  };

  toolsMarkup.actionRequestModal = {
    title: 'Добавление',
    message: 'Вы точно хотите добавить пользователя?',
    submitCallback: setRequestToAddUser
  };
};

// ############################## СЛУШАЕМ ЧЕКБОКСЫ ##############################
const onSuccessChangePermission = (answer) => {
  userStockPermissions.querySelectorAll('INPUT').forEach((elem) => elem.removeAttribute('disabled'));
  userOtherPermissions.querySelectorAll('INPUT').forEach((elem) => elem.removeAttribute('disabled'));
  onUserClick();
};

const changeStockPermission = (evt) => {
  userStockPermissions.querySelectorAll('INPUT').forEach((elem) => elem.setAttribute('disabled', 'disabled'));
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}/permission`,
    data: `business=${auth.data.currentBusiness}&code=${evt.target.value}&value=${(evt.target.checked ? 1 : 0)}&stock=${auth.currentStockId}&token=${auth.data.token}`,
    callbackSuccess: onSuccessChangePermission,
  };
};
const changeOtherPermission = (evt) => {
  userOtherPermissions.querySelectorAll('INPUT').forEach((elem) => elem.setAttribute('disabled', 'disabled'));
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}/permission`,
    data: `business=${auth.data.currentBusiness}&code=${evt.target.value}&value=${(evt.target.checked ? 1 : 0)}&token=${auth.data.token}`,
    callbackSuccess: onSuccessChangePermission,
  };
};

userStockPermissions.addEventListener('change', changeStockPermission);
userOtherPermissions.addEventListener('change', changeOtherPermission);

// ############################## ЗАГРУЗКА СПИСКА ПОЛЬЗОВАТЕЛЕЙ ##############################
usersReturnBtn.addEventListener('click', () => {
  getUsers();
  usersBody.classList.remove('d-none');
  userCard.classList.add('d-none');
  usersHeader.classList.remove('d-none');
});

const onSuccessUserInfoLoad = (userData) => {
  console.log('userData --> ', userData);
  let permissionList = {
    stock: {},
    other: []
  };
  let {name, status, id, color, operator_permissons: permissions, all_stocks: allSocks} = userData.data;
  userProfileName.innerHTML = name;
  userProfileStatus.innerHTML = status;
  userProfileId.innerHTML = auth.data.directory + '-' + id;
  userProfileImage.style.backgroundColor = '#' + color;

  if (permissions) {

    permissions.forEach((item) => {

      if (item.stock === '00') {
        permissionList.other.push(item.code);
      } else if (permissionList.stock[item.stock]) {
        permissionList.stock[item.stock].push(item.code);
      } else {
        permissionList.stock[item.stock] = [item.code];
      }
    });

    console.log(permissionList);
    const screenNamesStock = Object.keys(permissionsStock);

    const drawAccessForStock = (accessList) => `
          <div class="user-permissions-string">
            <span>${permissionsModule.permissionEngToRus[accessList[0]]}</span>
            <div>
              <input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsStock[accessList[0]]}" ${accessList[1]}>
            </div>
          </div>`;

    Object.keys(permissionList.stock).forEach((stockName) => {

      let stock = allSocks.find((item) => item.id === Number(stockName).toFixed());
      userStockList.insertAdjacentHTML('beforeEnd', `<span class="user-permissions-stock" data-stock-id=${Number(stockName).toFixed()}>${(stock) ? stock.name : ''}</span>`);

      let screens = screenNamesStock.map((screen) => permissionList.stock[stockName].includes(permissionsStock[screen].toString()) ? [screen, 'checked'] : [screen, '']);
      drawAccessForStock(screens[0]);

      userStockList.lastChild.addEventListener('click', () => {
        console.log(Number(stockName.split('-')[1]).toFixed());
        auth.currentStockId = Number(stockName).toFixed();
        onUserClick();
        console.log('screens-->', screens);

        userStockPermissions.innerHTML = screens.map(drawAccessForStock).join('');
        /*
        userStockPermissions.innerHTML = screens.map((screen) => `
          <div class="user-permissions-string">
            <span>${permissionsModule.permissionEngToRus[screen[0]]}</span>
            <div>
              <input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsStock[screen[0]]}" ${screen[1]}>
            </div>
          </div>`).join('');
        */
      });
    });
    userOtherPermissions.innerHTML = Object.keys(permissionsOther).map((screen) => {
      console.log(screen);
      return `
      <div class="user-permissions-string">
        <span>${permissionsModule.permissionEngToRus[screen]}</span>
        <div>
          <input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsOther[screen][0]}" ${permissionList.other.includes(permissionsOther[screen][0].toString()) ? 'checked' : ''}>
          <input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsOther[screen][1]}" ${permissionList.other.includes(permissionsOther[screen][1].toString()) ? 'checked' : ''}>
        </div>
      </div>`;
    }).join('');


  } else if (+auth.currentUserId === 1) {
    userStockList.innerHTML = '';
    userStockPermissions.innerHTML = 'У вас все права';
    userOtherPermissions.innerHTML = 'У вас все права';
  } else {
    userStockList.innerHTML = '';
    userStockPermissions.innerHTML = 'У вас нет прав';
    userOtherPermissions.innerHTML = 'У вас нет прав';
  }
  // drawUsers(usersData.data, usersBody, onUserClick);
};

// обработчик клика по пользователю
const onUserClick = () => {
  usersBody.classList.add('d-none');
  usersHeader.classList.add('d-none');
  userCard.classList.remove('d-none');

  userStockList.innerHTML = '';
  userStockPermissions.innerHTML = '';
  userOtherPermissions.innerHTML = '';

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}/info`,
    data: `business=${auth.data.currentBusiness}&token=${auth.data.token}`,
    callbackSuccess: onSuccessUserInfoLoad,
  };
};

const onSuccessUsersLoad = (usersData) => {
  console.log(usersData);
  drawUsers(usersData.data, usersBody, onUserClick);
};

const getUsers = () => {
  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.data.operatorId}`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessUsersLoad,
  };
};


export default {

  start() {
    usersList.addEventListener('click', getUsers);
    usersAddBtn.addEventListener('click', addUser);
  },

  // redraw: getdebitCredit,

  stop() {
    usersList.removeEventListener('click', getUsers);
    usersAddBtn.removeEventListener('click', addUser);
  }
};
