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
    <div class="reference-header" data-user-id="${item.id}">
      <div class="reference-column-3"> 
       <div style="background-color: #${item.color};   border-radius: 10px 10px 10px 10px;" width="60" >
          <img  src="img/user-male-filled-32.png" style="margin-left:1px; title="${item.name}"  width="24" height="24" alt="${item.name}">
          <span style="margin-right:2px; color:#ffffff;">${item.id}</span>
        </div>
        
        </div>
      <div class="reference-column-3">
        <div class="online-user">
          ${item.name}
        </div>
      </div>
      <div class="reference-column-3"><div class="user-status" style="background-color: #${(item.status === '0') ? 'dc3545' : '28a745'}"></div></div>
    </div>`;

  },

  drawDataInContainer(users, container, handler) {
    container.innerHTML = `
      <div class="reference-header">
          <div class="reference-column-3"></div>
          <div class="reference-column-3">Пользователь</div>
          <div class="reference-column-3">Статус</div>
      </div>
    `;
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
  auth.currentStockId = 1;
  if (users.length > 0) {
    markup.drawDataInContainer(users, container, handler);
  } else {
    container.innerHTML = 'Пользователей нет, все ушли на базу';
  }
};


// ############################## БЛОКИРОВКА ПОЛЬЗОВАТЕЛЯ #########################
const lockSuccess = (answer) => {
  // userProfileStatus.innerText = (+userProfileStatus.innerText === 0) ? '1' : '0';
  auth.currentUserStatus = (+auth.currentUserStatus === 0) ? 1 : 0;
  userProfileStatus.innerHTML = (+auth.currentUserStatus === 1) ? '<span class="text-success">Активен</span>' : '<span class="text-danger">Заблокирован</span>';
  console.log(answer);
};

const onUsersLockBtnClick = () => {
  xhr.request = {
    metod: 'PUT',
    url: `lopos_directory/${auth.data.directory}/operator/${auth.currentUserId}`,
    data: `status=${(+auth.currentUserStatus === 0) ? 1 : 0}&token=${auth.data.token}`,
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

const screenNamesStock = Object.keys(permissionsStock);

const drawAccessForStock = (accessList) => `
      <tr>
         <td><span>${permissionsModule.permissionEngToRus[accessList[0]]}</span></td>
          <td align=center> <input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsStock[accessList[0]]}" ${accessList[1]}></td>
             
      </tr>`;

const getScreens = (permissionList, stockName) => {
  let screens = screenNamesStock.map((screen) => {
    // console.log('screen-->', screen);
    // console.log('stockName-->', stockName);
    return permissionList.stock[stockName].includes(permissionsStock[screen].toString()) ? [screen, 'checked'] : [screen, ''];
  });

  return screens;
};

let permissionList = {};

const onSuccessUserInfoLoad = (userData) => {
  console.log(userData);

  let {name, status, id, color, operator_permissons: permissions, all_stocks: allSocks} = userData.data;

  permissionList = {
    stock: {},
    other: []
  };

  userProfileName.innerHTML = name;
  auth.currentUserStatus = status;
  userProfileStatus.innerHTML = (+auth.currentUserStatus === 1) ? '<span class="text-success">Активен</span>' : '<span class="text-danger">Заблокирован</span>';
  userProfileId.innerHTML = auth.data.directory + '-' + id;
  userProfileImage.style.backgroundColor = '#' + color;


  if (permissions) {

    permissions.forEach((item) => {
      if (item.stock === '00') {
        permissionList.other.push(item.code);
      } else if (permissionList.stock[(+item.stock)]) {
        permissionList.stock[(+item.stock)].push(item.code);
      } else {
        permissionList.stock[(+item.stock)] = [item.code];
      }
    });
  }

  allSocks.forEach((stock) => {
    if (!permissionList.stock[stock.id]) {
      permissionList.stock[(+stock.id)] = [];
    }
  });

  console.log('permissionList-->', permissionList);


  Object.keys(permissionList.stock).forEach((stockName) => {

    let stock = allSocks.find((item) => item.id === Number(stockName).toFixed());
    userStockList.insertAdjacentHTML('beforeEnd', `<span id="stock-${Number(stockName).toFixed()}" class="user-permissions-stock" data-stock-id=${Number(stockName).toFixed()}>${(stock) ? stock.name : ''}</span>`);

    // массив прав доступа для каждого склада, нужен для отрисовки по клику на склад
    let screens = getScreens(permissionList, stockName);

    // document.querySelector(`#stock-${auth.currentStockId}`).classList.add('btn-danger');
    userStockList.lastChild.addEventListener('click', (evt) => {
      auth.currentStockId = Number(stockName).toFixed();
      onUserClick();
      console.log('screens-->', screens);

      const preHeaderTableStock = ' <table class="user_table_property"> <tr class="user_table_header"><td>Действие</td><td class="user_table_property_w_40" >Просмотр</td></tr>';
      const BodyTableStock = screens.map(drawAccessForStock).join('');
      const postFooterTableStock = '</table>';
      userStockPermissions.innerHTML = preHeaderTableStock + BodyTableStock + postFooterTableStock;
    });
  });

  const preHeaderTableStock = ' <table class="user_table_property"> <tr class="user_table_header"><td>Действие</td><td  class="user_table_property_w_40" >Просмотр</td>     </tr>';
  const BodyTableStock = getScreens(permissionList, auth.currentStockId).map(drawAccessForStock).join('');
  const postFooterTableStock = '</table>';
  userStockPermissions.innerHTML = preHeaderTableStock + BodyTableStock + postFooterTableStock;

  document.querySelector(`#stock-${auth.currentStockId}`).classList.add('bg_backgorund_red');


  const preHeaderTableOther = ' <table class="user_table_property"> <tr class="user_table_header"><td>Действие</td><td class="user_table_property_w_40" >Просмотр</td><td class="user_table_property_w_40" >Действие</td>     </tr>';
  const BodyTableOther = Object.keys(permissionsOther).map((screen) => {
    return `
    <tr>
      <td><span>${permissionsModule.permissionEngToRus[screen]}</span></td>
      <td><input class="form-check-input position-static user-permissions-switch" type="checkbox" value="${permissionsOther[screen][0]}" ${permissionList.other.includes(permissionsOther[screen][0].toString()) ? 'checked' : ''}></td>
      <td><input class="form-check-input position-static user-permissions-switch ${(permissionsOther[screen][1] === '') ? 'd-none' : ''}" type="checkbox" value="${permissionsOther[screen][1]}" ${permissionList.other.includes(permissionsOther[screen][1].toString()) ? 'checked' : ''}></td>
    </tr>`;
  }).join('');
  const postFooterTableOther = '</table>';
  userOtherPermissions.innerHTML = preHeaderTableOther + BodyTableOther + postFooterTableOther;
 // document.querySelector(`#stock-${auth.currentStockId}`).classList.add('bg_backgorund_red');

  if (+auth.currentUserId === 1) {
    userStockList.innerHTML = '';
    userStockPermissions.innerHTML = 'У вас все права';
    userOtherPermissions.innerHTML = 'У вас все права';
  }
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
