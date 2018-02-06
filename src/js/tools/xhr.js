import toolsMarkup from '../markup/tools.js';

export default {

  set request(requestParameters) {

    const ErrorAttr = {
      FILE: 'xhr.js',
      MESSADGE: {
        JSON_ERR: 'XHR: JSON error converting response.',
        LOAD_ERR: 'Load Error.',
        CONNECT_ERR: 'Connection error.',
        TIMEOUT_ERR: 'Сonnection timeout exceeded'
      }
    };

    let getError = function (messadge, row, error) {
      let newError = new SyntaxError(messadge, ErrorAttr.FILE, row);
      newError.cause = error;
      return newError;
    };

    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        let response = '';

        try {
          response = JSON.parse(xhr.response);
          if (response.status === 280 && response.message === 'Invalid token') {
            toolsMarkup.informationtModal = {
              title: 'Что-то пошло не так...',
              message: 'Пожалуйста, авторизуйтесь заново'
            };
            document.dispatchEvent(new Event('authError'));
          }

        } catch (error) {
          toolsMarkup.informationtModal = {
            title: 'Что-то пошло не так...',
            message: 'Ошибка парсинга JSON'
          };
        }

        requestParameters.callbackSuccess(response);
      } else {
        if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
          requestParameters.callbackError(xhr);
        } else {
          toolsMarkup.informationtModal = {
            title: 'Что-то пошло не так...',
            message: 'Ошибка связи с сервером'
          };
        }
      }
    });

    xhr.addEventListener('error', function () {
      if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
        requestParameters.callbackError(xhr);
      } else {
        toolsMarkup.informationtModal = {
          title: '400',
          message: getError(`${ErrorAttr.MESSADGE.CONNECT_ERR} ${xhr.statusText}`, 42, '')
        };

      }
    });

    xhr.addEventListener('timeout', function () {
      if (requestParameters.callbackError && typeof requestParameters.callbackError === 'function') {
        requestParameters.callbackError(xhr);
      } else {
        toolsMarkup.informationtModal = {
          title: '400',
          message: getError(`${ErrorAttr.MESSADGE.CONNECT_ERR} (${xhr.timeout}ms.)`, 50, '')
        };
      }
    });

    xhr.timeout = window.appSettings.xhrSettings.timeout;
    xhr.open(requestParameters.metod, window.appSettings.xhrSettings.urlApi + requestParameters.url, true);
    // xhr.setRequestHeader('Content-Type', window.appSettings.xhrSettings.contentType);

    xhr.send(requestParameters.data);
  }

};
