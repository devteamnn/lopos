// valisettings

const formInpitHandler = (evt) => {
  let el = evt.target;

  el.classList.remove('border');
  el.classList.remove('border-danger');

  let parent = el.parentNode;

  while (parent.tagName !== 'FORM') {
    parent = parent.parentNode;
  }

  let span = parent.querySelector(`*[data-validLabel=${el.dataset.validlabelname}]`);
  span.innerHTML = '';

  parent.querySelector('button[type="submit"]').disabled = false;

  el.removeEventListener('input', formInpitHandler);

  console.log('HANDLER DEL');

};


const inputValid = (el, variable) => {
  let pattern = window.appSettings[el.dataset.valisettings].validPatterns;
  let message = window.appSettings[el.dataset.valisettings].validMessage;

  if (!pattern[el.dataset.valid].test(el.value)) {
    el.addEventListener('input', formInpitHandler);

    console.log('HANDLER ADD');

    el.classList.add('border');
    el.classList.add('border-danger');

    let parent = el.parentNode;

    while (parent.tagName !== 'FORM') {
      parent = parent.parentNode;
    }

    let span = parent.querySelector(`*[data-validLabel=${el.dataset.validlabelname}]`);
    span.innerHTML = message[el.dataset.valid];

    parent.querySelector('button[type="submit"]').disabled = true;

    return false;
  }

  return true;

};

export default {
  valid: inputValid
};
