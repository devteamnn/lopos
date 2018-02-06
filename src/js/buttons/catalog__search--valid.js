// valisettings

const formInpitHandler = (evt) => {
  let el = evt.target;

  el.classList.remove('border');
  el.classList.remove('border-danger');

  let parent = el.parentNode;

  while (parent.tagName !== 'form') {
    parent = parent.parentNode;
  }

  let span = parent.querySelrctor(`*[data-validLabel=${el.dataset.validlabelname}]`);
  span.innerHTML = '';

  el.removeEventListener('input', formInpitHandler);

  console.log('HANDLER DEL');

};


const inputValid = (el, variable) => {
  let pattern = window.appSettings[el.dataset.valisettings].validPatterns;
  let validMessage = window.appSettings[el.dataset.valisettings].validMessage;

  if (!pattern[el.dataset.valid].test(el.value)) {
    el.addEventListener('input', formInpitHandler);

    console.log('HANDLER DEL');

    el.classList.add('border');
    el.classList.add('border-danger');

    let parent = el.parentNode;

    while (parent.tagName !== 'form') {
      parent = parent.parentNode;
    }

    let span = parent.querySelrctor(`*[data-validLabel=${el.dataset.validlabelname}]`);
    span.innerHTML = validMessage[el.dataset.valid];

    return false;
  }

  return true;

};

export default {
  valid: inputValid
};
