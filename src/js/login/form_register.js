import mainWindow from './main_login_window.js';
import register from './register.js';
import captcha from './../tools/captcha.js';

const sectionRegister = document.querySelector('#sectionRegister');
const registerForm = sectionRegister.querySelector('#registerForm');
const registerInputName = registerForm.querySelector('#registerInputName');
const registerInputEmail = registerForm.querySelector('#registerInputEmail');
const registerInputPassword = registerForm.querySelector('#registerInputPassword');
const registerInputConfirmPassword = registerForm.querySelector('#registerInputConfirmPassword');
const registerButtonCancel = registerForm.querySelector('#registerButtonCancel');
const registerUserAgreement = document.querySelector('#registerUserAgreement');
const registerCaptcha = sectionRegister.querySelector('#registerCaptcha');
const registerButtonUserAgreement = sectionRegister.querySelector('#registerButtonUserAgreement');

let captchaId = 'NO';

let captchaCallback = function () {

  mainWindow.showProgress('registerButtonSubmit', 'registerProgress');

  if (captcha.getResponse(captchaId)) {
    captcha.catchaReset(captchaId);
  }

  register.submit(registerInputName.value, registerInputEmail.value, registerInputPassword.value);

};

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (register.validate(registerInputName.value, registerInputEmail.value, registerInputPassword.value,
    registerInputConfirmPassword.value, registerUserAgreement.checked)) {

    if (!window.captchaErr) {
      mainWindow.showProgress(false, 'registerProgress');
      captcha.captchaExec(captchaId);
    } else {
      mainWindow.showProgress('registerButtonSubmit', 'registerProgress');
      register.submit(registerInputName.value, registerInputEmail.value, registerInputPassword.value);
    }

  }

});

registerButtonCancel.addEventListener('click', function () {
  mainWindow.init();
});

registerButtonUserAgreement.addEventListener('click', function () {
  // window.location = 'http://bidone.ru/lopos_terms_and_agreements';
  window.open('http://bidone.ru/lopos_terms_and_agreements');
});

export default {

  show() {
    sectionRegister.classList.remove('d-none');
  },

  hide() {
    sectionRegister.classList.add('d-none');
  },

  reset() {
    registerForm.reset();
    registerInputName.setCustomValidity('');
    registerInputEmail.setCustomValidity('');
    registerInputPassword.setCustomValidity('');
    registerInputConfirmPassword.setCustomValidity('');

    if (captchaId !== 'NO') {
      captcha.catchaReset(captchaId);
    }
  },

  submitForm() {
    register.submit(registerInputName.value, registerInputEmail.value, registerInputPassword.value,
      registerInputConfirmPassword.value, registerUserAgreement.checked);
  },

  setCaptcha() {
    captchaId = captcha.getCaptcha(registerCaptcha, captchaCallback);
  },
};
