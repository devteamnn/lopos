// теги в разметке:
//   <form>
//      data-formName = appSettings.{formName}
//   <input>
//      data-valid = appSettings.formName.validPatterns.{valid}
//      data-validLabelName = data-validLabel на сообщении о валидации
//   <сообщение>
//      data-validLabel = appSettings.formName.validMessage.{data-validLabel}
//   <спиннер>
//      data-spinner
//   <кнопка отмены>
//      data-butCancel


// Параметры work:
//   remoteForm - форма
//   remoteSubmitCallback - функция должн возвращать объект:
//     {
//       url: ссылка на апи,
//       metod: метод http,
//       data: строка data,
//     }
//   remoteXhrCallbackSuccess - функция, в которую передается управление при
//      успешном запросе
//
//   remoteValidCallback - параметр validCallback передается для дополнительной
//      проверки
//     (когда недостаточно проверить текстовые поля по шаблонам).
//     Должен возвращать true или false.
//

import xhr from './xhr.js';

let form;
let userXhrCallbackSuccess;
let pattern;
let message;
let submitCallback;
let validCallback;

let elSaveValues;

const showAlert = (el) => {
  if (el.type === 'text') {
    el.classList.add('border');
    el.classList.add('border-danger');
    form.querySelector(`*[data-validLabel="${el.dataset.validlabelname}"]`).innerHTML =
      message[el.dataset.valid];
  }
};

const hideAlert = (el) => {
  if (el.type === 'text') {
    el.classList.remove('border');
    el.classList.remove('border-danger');
    form.querySelector(`*[data-validLabel="${el.dataset.validlabelname}"]`).innerHTML = '';
  }
};

const showSpinner = () => {
  form.querySelector('*[data-spinner]').classList.remove('invisible');
  form.querySelector('button[type="submit"]').disabled = true;
  form.querySelector('*[data-butCancel]').disabled = true;
};

const hideSpinner = () => {
  form.querySelector('*[data-spinner]').classList.add('invisible');
  form.querySelector('button[type="submit"]').disabled = false;
  form.querySelector('*[data-butCancel]').disabled = false;
};

const delHandlers = () => {
  form.removeEventListener('submit', formSubmitHandler);
  form.removeEventListener('input', formInputHandler);
};

const formReset = () => {
  form.reset();

  form.querySelectorAll('*[data-valid]').forEach((el) => {
    hideAlert(el);
  });

  hideSpinner();
  form.querySelector('button[type="submit"]').disabled = true;
  delHandlers();
};

const xhrCallbackSuccess = (responce) => {
  hideSpinner();
  userXhrCallbackSuccess(responce);
};

const validateForm = () => {

  let valid = true;
  let otherValid = validCallback ? validCallback() : true;
  let elements = form.querySelectorAll('*[data-valid]');

  elements.forEach((el) => {
    if (!pattern[el.dataset.valid].test(el.value)) {
      valid = false;
      showAlert(el);
    }
  });

  return valid && otherValid;
};

const formIsChange = () => {
  let change = false;

  form.querySelectorAll('*[data-valid]').forEach((el, index) => {
    if (el.value !== elSaveValues[index]) {
      change = true;
    }
  });

  return change;
};

const formSubmitHandler = (evt) => {
  evt.preventDefault();

  if (validateForm()) {

    showSpinner();
    let respData = submitCallback();
    respData.callbackSuccess = xhrCallbackSuccess;
    xhr.request = respData;
  }
};

const formInputHandler = (evt) => {
  hideAlert(evt.target);

  if (formIsChange()) {
    form.querySelector('button[type="submit"]').disabled = false;
  } else {
    form.querySelector('button[type="submit"]').disabled = true;
  }
};

const addHandlersFunc = (remoteForm, remoteSubmitCallback, remoteXhrCallbackSuccess, remoteValidCallback) => {

  form = remoteForm;
  userXhrCallbackSuccess = remoteXhrCallbackSuccess;
  submitCallback = remoteSubmitCallback;
  validCallback = remoteValidCallback;
  pattern = window.appSettings[form.dataset.formname].validPatterns;
  message = window.appSettings[form.dataset.formname].validMessage;

  elSaveValues = [];

  form.querySelectorAll('*[data-valid]').forEach((el) => {
    elSaveValues.push(el.value);
  });

  form.addEventListener('submit', formSubmitHandler);
  form.addEventListener('input', formInputHandler);

};

const valEl = (el) => {
  if (pattern[el.dataset.valid].test(el.value)) {
    return true;
  }
  showAlert(el);
  return false;
};


export default {

  work: addHandlersFunc,
  reset: formReset,
  validElement: valEl
};
