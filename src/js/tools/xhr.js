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
    setMessage(response.message, false);
    // Если есть errorCallback - вызываем
    if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
      requestParameters.callbackError();
    }
    break;
  case 272:
    requestParameters.callbackSuccess(response);
    break;
  case 273:
    setMessage(response.message, false);
    // Если есть errorCallback - вызываем
    if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
      requestParameters.callbackError();
    }
    break;
  case 280:
    setMessage(response.message, false);
    document.dispatchEvent(new Event('authError'));
    break;
  case 281:
    requestParameters.callbackSuccess(response);
    break;

  case 400:
    setMessage(messages.mes400, false);
    // Если есть errorCallback - вызываем
    if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
      requestParameters.callbackError();
    }
    break;
  }
};

const xhrLoadHandler = () => {
  if (xhr.status === 200) {
    let response = '';

    try {
      response = JSON.parse(xhr.response);
    } catch (error) {
      // Вывод ошибки парсинга
      setMessage('Ошибка разбора JSON', false);
      // Если есть errorCallback - вызываем
      if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
        requestParameters.callbackError();
      }
    }

    // Разбираем коды ответа APILopos
    parseRespCodes(response);
  } else {
    // Ошибка, которую возвращает сервер
    setMessage('Ошибка разбора JSON', false);
    // Если есть errorCallback - вызываем
    if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
      requestParameters.callbackError();
    }
  }
};

const xhrErrorHandler = () => {
  // Ошибка, которую возвращает сервер
  setMessage(`Ошибка связи: ${xhr.status}: ${xhr.statusText}`, false);
  // Если есть errorCallback - вызываем
  if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
    requestParameters.callbackError();
  }
};

const xhrTimeoutHandler = () => {
  // Ошибка, которую возвращает сервер
  setMessage('Превышено время ожидания ответа от сервера', false);
  // Если есть errorCallback - вызываем
  if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
    requestParameters.callbackError();
  }
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

// export default {

//   set request(),

// };

  //         if (response.status === 280 && response.message === 'Invalid token') {
  //           toolsMarkup.informationtModal = {
  //             title: 'Что-то пошло не так...',
  //             message: 'Пожалуйста, авторизуйтесь заново'
  //           };
  //           document.dispatchEvent(new Event('authError'));
  //         }

  //       } catch (error) {
  //         toolsMarkup.informationtModal = {
  //           title: 'Что-то пошло не так...',
  //           message: 'Ошибка парсинга JSON'
  //         };
  //       }

  //       requestParameters.callbackSuccess(response);
  //     } else {
  //       if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
  //         requestParameters.callbackError(xhr);
  //       } else {
  //         toolsMarkup.informationtModal = {
  //           title: 'Что-то пошло не так...',
  //           message: 'Ошибка связи с сервером'
  //         };
  //       }
  //     }
  //   });

  //   xhr.addEventListener('error', function () {
  //     if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
  //       requestParameters.callbackError(xhr);
  //     } else {
  //       toolsMarkup.informationtModal = {
  //         title: '400',
  //         message: getError(`${ErrorAttr.MESSADGE.CONNECT_ERR} ${xhr.statusText}`, 42, '')
  //       };

  //     }
  //   });

  //   xhr.addEventListener('timeout', function () {
  //     if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
  //       requestParameters.callbackError(xhr);
  //     } else {
  //       toolsMarkup.informationtModal = {
  //         title: '400',
  //         message: getError(`${ErrorAttr.MESSADGE.CONNECT_ERR} (${xhr.timeout}ms.)`, 50, '')
  //       };
  //     }
  //   });

  //   xhr.timeout = window.appSettings.xhrSettings.timeout;
  //   xhr.open(requestParameters.metod, window.appSettings.xhrSettings.urlApi + requestParameters.url, true);
  //   // xhr.setRequestHeader('Content-Type', window.appSettings.xhrSettings.contentType);

  //   xhr.send(requestParameters.data);
  // }
