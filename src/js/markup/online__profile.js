import auth from '../tools/storage.js';

const listProfile = document.querySelector('#list-profile');

const prepareProfileMarkup = () => `
                    <table >
                       <tr>
                          <th><h3>Личный кабинет:</h3></th>
                          <th> </th> 
                       
                        </tr>
                        <tr>
                           <td><span>Имя:</span></td>
                            <td><span>${auth.data.nickname}</span></td>
                        </tr>
                         <tr>
                           <td><span>Последний входа:</span></td>
                            <td><span>${auth.data.lastLogin}</span></td>
                        </tr>
                         <tr>
                           <td><span>Каталог:</span></td>
                            <td><span>${auth.data.directory}</span></td>
                        </tr>
                         <tr>
                           <td><span>Почта:</span></td>
                            <td><span>${auth.data.email}</span></td>
                        </tr>
                         <tr>
                           <td><span>Тариф:</span></td>
                            <td><span>Бесплатная весна</span></td>
                        </tr>
                    </table>`;

export default {
  setProfile() {
    listProfile.innerHTML = (auth.isSetFlag) ? prepareProfileMarkup() : '';
  },

  clearProfile() {
    listProfile.innerHTML = '';
  }
};

/*

  <div id="profile" class="card p-3 w-50 text-dark">
    <h3>Личный кабинет</h3>
    <p><span>Имя: </span><span>${auth.data.nickname}</span></p>
    <p><span>Время последнего входа: </span><span>${auth.data.lastLogin}</span></p>
    <p><span></span>Каталог: <span>${auth.data.directory}</span></p>
    <p><span></span>Почта: <span>${auth.data.email}</span></p>
  </div>
  */
