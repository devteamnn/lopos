const modalActionRequest = document.querySelector('#modal-action-request');
const modalActionRequestTitle = modalActionRequest.querySelector('#modal-action-request-title');
const modalActionRequestMessage = modalActionRequest.querySelector('#modal-action-request-message');
const modalActionRequestSubmit = modalActionRequest.querySelector('#modal-action-request-submit');

const modalUniversalAdd = document.querySelector('#universal-add');
const modalUniversalAddLabel = document.querySelector('#universal-add-label');
const modalUniversalAddForm = document.querySelector('#universal-add-form');
const modalUniversalAddName = document.querySelector('#universal-add-name');
const modalUniversalAddNameLabel = document.querySelector('#universal-add-name-label');
const modalUniversalAddSubmit = document.querySelector('#universal-add-submit');

const alertBlock = document.querySelector('#alertBlock');

export default {

  getWaitSpinner(id, message) {
    return `
      <div id="loader" class="progress text-white" style="height: 25px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated text-white font-weight-bold text-uppercase bg-success" style="width: 100%" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${message}</div>
      </div>`;
  },

  getLoadSpinner(id, message) {
    return `
      <div id="${id}" class="progress text-white" style="height: 25px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated text-white font-weight-bold text-uppercase" style="width: 100%" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${message}</div>
      </div>`;
  },

  getError(id, message) {
    return `
      <div id="loader-fail" class="container-fluid bg-danger text-white text-center mb-5" style="height: 25;">${message}</div>`;
  },

  set actionRequestModal(setup) {

    const requestHandler = () => {
      setup.submitCallback();
      modalActionRequestSubmit.removeEventListener('click', requestHandler);
    };

    $(modalActionRequest).modal('show');
    modalActionRequestTitle.innerHTML = setup.title;
    modalActionRequestMessage.innerHTML = setup.message;
    modalActionRequestSubmit.addEventListener('click', requestHandler);
  },

  set informationtModal(setup) {
    // setup = {
    //   isMess: true - зеленое, alert: красное
    //   title: заголовок
    //   message: сообщение
    // }

    let type = (setup.isMess === true) ? 'alert-success' : 'alert-danger';

    alertBlock.innerHTML = alertBlock.innerHTML +
      `<div id="alert" class="alert ${type} fade show" role="alert">
        <strong>${setup.title} </strong> ${setup.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
    window.setTimeout(() => {
      let block = alertBlock.firstChild;
      if (block) {
        block.remove();
      }
    }, 5000);
  },

  set runUniversalAdd(setup) {
    const requestHandler = (evt) => {
      evt.preventDefault();
      setup.submitCallback(modalUniversalAddName.value);
      modalUniversalAddForm.removeEventListener('submit', requestHandler);
      $(modalUniversalAdd).modal('hide');
    };

    $(modalUniversalAdd).modal('show');
    $(modalUniversalAdd).on('shown.bs.modal', function () {
      $('#universal-add-name').trigger('focus');
    });
    modalUniversalAddLabel.innerHTML = setup.title;
    modalUniversalAddNameLabel.innerHTML = setup.inputLabel;
    modalUniversalAddName.setAttribute('placeholder', setup.inputPlaceholder);
    modalUniversalAddName.value = (setup.inputValue) ? setup.inputValue : '';
    modalUniversalAddSubmit.innerHTML = setup.submitBtnName;
  }
};
