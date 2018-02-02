import mainWindow from './main_login_window.js';
import login from './login.js';
import captcha from './../tools/captcha.js';

const sectionLogin = document.querySelector('#sectionLogin');
const loginForm = sectionLogin.querySelector('#loginForm');
const loginInputLogin = sectionLogin.querySelector('#loginInputLogin');
const loginInputPassword = sectionLogin.querySelector('#loginInputPassword');
const loginButtonRegister = loginForm.querySelector('#loginButtonRegister');
const loginButtonForgot = loginForm.querySelector('#loginButtonForgot');
const loginCaptcha = loginForm.querySelector('#loginCaptcha');

let captchaCount = 0;
let captchaId = 'NO';
let userLogin;

let captchaCallback = function () {

  mainWindow.showProgress('loginButtonSubmit', 'loginProgress');

  if (captcha.getResponse(captchaId)) {
    captcha.catchaReset(captchaId);
  }

  login.submit(userLogin, loginInputPassword.value);
};

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  userLogin = formatLogin(loginInputLogin.value);

  if (login.validate(userLogin, loginInputPassword.value)) {

    if (!window.captchaErr && captchaCount >= 3) {
      mainWindow.showProgress(false, 'loginProgress');
      captcha.captchaExec(captchaId);
    } else {
      mainWindow.showProgress('loginButtonSubmit', 'loginProgress');
      login.submit(userLogin, loginInputPassword.value);
    }
  }
});

let formatLogin = function (userlogin) {
  userlogin = userlogin.toLowerCase();
  userlogin = userlogin.replace(/-/g, '');
  return userlogin;
};

loginButtonRegister.addEventListener('click', function () {
  mainWindow.register();
});

loginButtonForgot.addEventListener('click', function () {
  mainWindow.forgot();
});

export default {

  show() {
    sectionLogin.classList.remove('d-none');
  },

  hide() {
    sectionLogin.classList.add('d-none');
  },

  reset() {
    loginForm.reset();
    loginInputLogin.setCustomValidity('');
    loginInputPassword.setCustomValidity('');

    if (captchaId !== 'NO') {
      captcha.catchaReset(captchaId);
    }
  },

  addCaptchaCount() {
    captchaCount++;
  },

  setCaptcha() {
    captchaId = captcha.getCaptcha(loginCaptcha, captchaCallback);
  },
};
