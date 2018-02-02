import mainWindow from './main_login_window.js';
import confirmEmail from './confirm_email.js';
import captcha from './../tools/captcha.js';

const sectionConfirmEmail = document.querySelector('#sectionConfirmEmail');
const emailConfirmForm = sectionConfirmEmail.querySelector('#emailConfirmForm');
const emailConfirmInputKey = emailConfirmForm.querySelector('#emailConfirmInputKey');
const emailConfirmButtonCancel = emailConfirmForm.querySelector('#emailConfirmButtonCancel');
const emailConfirmCaptcha = sectionConfirmEmail.querySelector('#emailConfirmCaptcha');

const registerInputEmail = document.querySelector('#registerInputEmail');

let captchaId = 'NO';

let captchaCallback = function () {
  mainWindow.showProgress('emailConfirmButtonSubmit', 'confirmProgress');

  if (captcha.getResponse(captchaId)) {
    captcha.catchaReset(captchaId);
  }

  confirmEmail.submit(emailConfirmInputKey.value, registerInputEmail.value);
};

emailConfirmForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (confirmEmail.validate(emailConfirmInputKey.value)) {

    if (!window.captchaErr) {
      mainWindow.showProgress(false, 'confirmProgress');
      captcha.captchaExec(captchaId);
    } else {
      mainWindow.showProgress('emailConfirmButtonSubmit', 'confirmProgress');
      confirmEmail.submit(emailConfirmInputKey.value, registerInputEmail.value);
    }

  }
});

emailConfirmButtonCancel.addEventListener('click', function () {
  mainWindow.init();
});

export default {
  show() {
    sectionConfirmEmail.classList.remove('d-none');
  },

  hide() {
    sectionConfirmEmail.classList.add('d-none');
  },

  reset() {
    emailConfirmForm.reset();
    emailConfirmInputKey.setCustomValidity('');

    if (captchaId !== 'NO') {
      captcha.catchaReset(captchaId);
    }
  },

  submitForm() {
    confirmEmail.submit(emailConfirmInputKey.value, registerInputEmail.value);
  },

  setCaptcha() {
    captchaId = captcha.getCaptcha(emailConfirmCaptcha, captchaCallback);
  }
};
