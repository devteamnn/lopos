import formTools from './../tools/form-tools.js';
let form;


const formInpitHandler = (evt) => {
  formTools.hideAlert(evt.target);
};

const addHandlers = (remform) => {
  form = remform;
  formTools.setForm(form);
  form.addEventListener('input', formInpitHandler);
};

const delHandlers = () => {
  form.removeEventListener('input', formInpitHandler);
};

const inputValid = (el) => {
  return formTools(el);
};

export default {
  start: addHandlers,
  stop: delHandlers,
  valid: inputValid
};
