import toolsMarkup from '../markup/tools.js';
let xhr;
let requestParameters;
let messages;

// mess - сообщение, type = true/false - сообщение/ошибка
const setMessage = (mess, type) => {
  toolsMarkup.informationtModal = {
    'title': (type) ? 'MESSAGE: ' : 'ERROR: ',
    'message': mess,
    'isMess': type
  };
};

const setError = (msg) => {
  setMessage(msg, false);
  // Если есть errorCallback - вызываем
  if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
    requestParameters.callbackError();
  }
};

const parseRespCodes = (response) => {
  switch (response.status) {
  case 200:
    requestParameters.callbackSuccess(response);
    break;
  case 270:
    setMessage(response.message, true);
    requestParameters.callbackSuccess(response);
    break;
  case 271:
    setError(response.message);
    break;
  case 272:
    requestParameters.callbackSuccess(response);
    break;
  case 273:
    setError(response.message);
    break;
  case 280:
    setMessage(response.message, false);
    document.dispatchEvent(new Event('authError'));
    break;
  case 281:
    requestParameters.callbackSuccess(response);
    break;
  case 400:
    setError(messages.responseStatus.res400);
    break;
  }
};

const xhrLoadHandler = () => {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      let response = '';

      try {
        response = JSON.parse(xhr.response);
      } catch (error) {
        // Вывод ошибки парсинга
        setError(messages.xhrJsonError);
      }

      // Разбираем коды ответа APILopos
      parseRespCodes(response);
    } else {
      // Внутренняя ошибка HTTP
      setError(messages.xhrError);
    }
  }
};

const xhrErrorHandler = () => {
  // Ошибка, которую возвращает сервер
  setError(messages.xhrError);
};

const xhrTimeoutHandler = () => {
  // Ошибка, которую возвращает сервер
  setError(messages.xhrTimeoutError);
};

const xhrRun = () => {
  xhr = new XMLHttpRequest();

  xhr.addEventListener('load', xhrLoadHandler);
  // Слушаем событие ошибки XHR
  xhr.addEventListener('error', xhrErrorHandler);
  // Слушаем событие таймаута связи
  xhr.addEventListener('timeout', xhrTimeoutHandler);

  xhr.timeout = window.appSettings.xhrSettings.timeout;
  xhr.open(requestParameters.metod, window.appSettings.xhrSettings.urlApi + requestParameters.url, true);
  xhr.send(requestParameters.data);
};

export default {
  set request(parameters) {
    requestParameters = parameters;
    messages = window.appSettings .messages;
    xhrRun();
  }
};
