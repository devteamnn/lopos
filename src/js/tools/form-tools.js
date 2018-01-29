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
// -----------------------------------------------------------------------------
//   remoteForm - форма
// -----------------------------------------------------------------------------
//   remoteSubmitCallback - массив функций должны возвращать объект:
//     {
//       url: ссылка на апи,
//       metod: метод http,
//       data: строка data,
//     }
//   Массив нужен для отправок отправок разных полей по разным адресам
// -----------------------------------------------------------------------------
//   remoteXhrCallbackSuccess - функция, в которую передается управление при
//      успешном запросе
// -----------------------------------------------------------------------------
//   remoteValidCallback - параметр validCallback передается для дополнительной
//      проверки
//     (когда недостаточно проверить текстовые поля по шаблонам).
//     Должен возвращать true или false.
//

import xhr from './xhr.js';

let butSubmit;
let butCancel;
let spinner;

let form;
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
  spinner.classList.remove('invisible');
  butSubmit.disabled = true;
  butCancel.disabled = true;
};

const hideSpinner = () => {
  spinner.classList.add('invisible');
  butSubmit.disabled = false;
  butCancel.disabled = false;
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
  butSubmit.disabled = true;
  delHandlers();
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
    submitCallback();
  }
};

const submitForm = (data) => {
  xhr.request = data;
};

const formInputHandler = (evt) => {
  hideAlert(evt.target);

  if (formIsChange()) {
    butSubmit.disabled = false;
  } else {
    butSubmit.disabled = true;
  }
};

const addHandlersFunc = (remoteForm, remoteSubmitCallback, remoteValidCallback) => {

  form = remoteForm;
  submitCallback = remoteSubmitCallback;
  validCallback = remoteValidCallback;
  pattern = window.appSettings[form.dataset.formname].validPatterns;
  message = window.appSettings[form.dataset.formname].validMessage;

  butSubmit = form.querySelector('button[type="submit"]');
  butCancel = form.querySelector('*[data-butCancel]');
  spinner = form.querySelector('*[data-spinner]');

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
  validElement: valEl,
  submit: submitForm
};
