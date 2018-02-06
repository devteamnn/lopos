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
//   Тег для всех элементов отмены (по клику на них сбрасывается форма)
//      data-cancel


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

let modal;
let form;
let pattern;
let message;
let submitCallback;
let validCallback;

let elSaveValues;

const showAlert = (el) => {
  if (el.dataset.valid && (el.dataset.valid !== 'none')) {
    el.classList.add('border');
    el.classList.add('border-danger');
    form.querySelector(`*[data-validLabel="${el.dataset.validlabelname}"]`).innerHTML =
      message[el.dataset.valid];
  }
};

const hideAlert = (el) => {
  if (el.dataset.valid && (el.dataset.valid !== 'none')) {
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
  console.log('FORM ID = ' + form.id);
  console.log('DEL HANDLERS');
  modal.removeEventListener('click', modalClickHandler);
  form.removeEventListener('submit', formSubmitHandler);
  form.removeEventListener('input', formInputHandler);

  modal.querySelectorAll('*[data-cancel]').forEach((el) => {
    el.removeEventListener('click', cancelClickHandler);
  });

  modal.removeEventListener('keydown', modalKeyDownHandler);
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
    if (el.dataset.valid !== 'none') {
      if (!pattern[el.dataset.valid].test(el.value)) {
        valid = false;
        showAlert(el);
      }
    }
  });

  return valid && otherValid;
};

const elementIsChange = (el, index) => {
  if (el.value !== elSaveValues[index]) {
    return true;
  }
  return false;
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
  if (evt.target.tagName === 'INPUT' && evt.target.type !== 'file') {
    hideAlert(evt.target);

    let change = false;

    form.querySelectorAll('*[data-valid]').forEach((el, index) => {
      if (elementIsChange(el, index)) {
        change = true;
      }
    });

    if (change) {
      butSubmit.disabled = false;
    } else {
      butSubmit.disabled = true;
    }
  }
};

const formChangeHandler = (evt) => {
  if (evt.target.tagName === 'INPUT' && evt.target.type === 'file') {
    hideAlert(evt.target);

    let change = false;

    form.querySelectorAll('*[data-valid]').forEach((el, index) => {
      if (elementIsChange(el, index)) {
        change = true;
      }
    });

    if (change) {
      butSubmit.disabled = false;
    } else {
      butSubmit.disabled = true;
    }
  }
};

const cancelClickHandler = (evt) => {
  formReset();
};

const modalClickHandler = (evt) => {
  if (evt.target === modal) {
    formReset();
  }
};

const modalKeyDownHandler = (evt) => {
  if (evt.keyCode === 27) {
    formReset();
  }
};

const setSettingsVar = () => {
  pattern = window.appSettings[form.dataset.formname].validPatterns;
  message = window.appSettings[form.dataset.formname].validMessage;
};

const addHandlersFunc = (remoteModal, remoteSubmitCallback, remoteValidCallback) => {
  modal = remoteModal;
  form = modal.querySelector('*[data-formName]');
  submitCallback = remoteSubmitCallback;
  validCallback = remoteValidCallback;

  setSettingsVar();

  butSubmit = form.querySelector('button[type="submit"]');
  butCancel = form.querySelector('*[data-butCancel]');
  spinner = form.querySelector('*[data-spinner]');

  elSaveValues = [];

  let elements = form.querySelectorAll('*[data-valid]');
  elements.forEach((el) => {
    elSaveValues.push(el.value);
  });

  form.addEventListener('submit', formSubmitHandler);
  form.addEventListener('input', formInputHandler);
  form.addEventListener('change', formChangeHandler);
  modal.querySelectorAll('*[data-cancel]').forEach((el) => {
    el.addEventListener('click', cancelClickHandler);
  });
  modal.addEventListener('click', modalClickHandler);
  modal.addEventListener('keydown', modalKeyDownHandler);


  console.log('FORM ID = ' + form.id);
  console.log('ADD HANDLERS');
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
  removeHandlers: delHandlers,
  validElement: valEl,
  submit: submitForm,
};
