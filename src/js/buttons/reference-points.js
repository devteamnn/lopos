import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import pointsMarkup from '../markup/reference-points.js';
import toolsMarkup from '../markup/tools.js';

const loaderSpinnerId = 'loader-enterprises';
const loaderSpinnerMessage = 'Загрузка';
const loaderSpinnerMarkup = toolsMarkup.getLoadSpinner(loaderSpinnerId, loaderSpinnerMessage);

const listPoints = document.querySelector('#list-points-list');
const listPointsBody = document.querySelector('#list-points-body');
const pointsCheckBtn = document.querySelector('#points-check');
const pointsEditBtn = document.querySelector('#points-edit-btn');
const pointsEditName = document.querySelector('#points-edit-name');

const enableCheckEditButtons = () => {
  pointsCheckBtn.removeAttribute('disabled');
  pointsEditBtn.removeAttribute('disabled');
};

const disableCheckEditButtons = () => {
  pointsCheckBtn.setAttribute('disabled', 'disabled');
  pointsEditBtn.setAttribute('disabled', 'disabled');
};

const onSuccessPointsLoad = (loadedPoints) => {
  document.querySelector(`#${loaderSpinnerId}`).remove();
  if (loadedPoints.status === 200) {
    console.log(loadedPoints);
    pointsMarkup.drawDataInContainer(loadedPoints.data);
  } else {
    pointsMarkup.drawMarkupInContainer(`<p>${loadedPoints.message}</p>`);

  }
};

let selectedString = '';
disableCheckEditButtons();

const onErrorPointsLoad = (error) => {
  console.log(error);
};

listPointsBody.addEventListener('change', function (evt) {
  console.log(evt);
  if (selectedString) {
    selectedString.classList.remove('bg-light');
  }
  selectedString = evt.target.labels[0];
  selectedString.classList.add('bg-light');
  auth.currentStockId = selectedString.dataset.stockId;
  enableCheckEditButtons();
});

pointsCheckBtn.addEventListener('click', function () {
  if (!pointsCheckBtn.hasAttribute('disabled')) {
    auth.currentStock = selectedString.dataset.stockId;
    disableCheckEditButtons();
    getPoints();
  }
});

pointsEditBtn.addEventListener('click', function () {
  if (!pointsEditBtn.hasAttribute('disabled')) {
    auth.currentStockId = selectedString.dataset.stockId;
    auth.currentStockName = selectedString.dataset.stockName;
    pointsEditName.value = selectedString.dataset.stockName;
  }
});

const getPoints = () => {
  disableCheckEditButtons();

  pointsMarkup.cleanContainer();
  pointsMarkup.drawMarkupInContainer(loaderSpinnerMarkup);

  xhr.request = {
    metod: 'POST',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/stock`,
    data: `view_last=0&token=${auth.data.token}`,
    callbackSuccess: onSuccessPointsLoad,
    callbackError: onErrorPointsLoad
  };
};

export default {

  start() {
    listPoints.addEventListener('click', getPoints);
  },

  redraw: getPoints,

  stop() {
    pointsMarkup.cleanContainer();
    listPoints.removeEventListener('click', getPoints);
  }
};
