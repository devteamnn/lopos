import auth from '../tools/storage.js';

const listProfile = document.querySelector('#list-profile');

const prepareProfileMarkup = () => `
  <div id="profile" class="card p-3 w-50 text-dark">
    <h3>Личный кабинет</h3>
    <p><span>Имя: </span><span>${auth.data.nickname}</span></p>
    <p><span>Время последнего входа: </span><span>${auth.data.lastLogin}</span></p>
    <p><span></span>Каталог: <span>${auth.data.directory}</span></p>
    <p><span></span>Почта: <span>${auth.data.email}</span></p>
  </div>`;

export default {
  setProfile() {
    listProfile.innerHTML = (auth.isSetFlag) ? prepareProfileMarkup() : '';
  },

  clearProfile() {
    listProfile.innerHTML = '';
  }
};
