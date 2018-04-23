import toolsMarkup from '../markup/tools.js';

export default {
  set request(parameters) {
    let xhr;
    let messages = window.appSettings.messages;

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
      if (parameters.callbackError && typeof parameters.callbackError === 'function') {
        parameters.callbackError();
      }
    };

    const parseRespCodes = (response) => {
      switch (response.status) {
      case 200:
        console.log('------- xhr responce -------');
        console.dir(response.data);
        console.log('----------------------------');

        parameters.callbackSuccess(response);
        break;
      case 270:
        setMessage(response.message, true);
        parameters.callbackSuccess(response);
        break;
      case 271:
        setError(response.message);
        break;
      case 272:
        parameters.callbackSuccess(response);
        break;
      case 273:
        setError(response.message);
        break;
      case 280:
        setMessage(response.message, false);
        document.dispatchEvent(new Event('authError'));
        break;
      case 281:
        parameters.callbackSuccess(response);
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

    // const xhrRun = () => {
    xhr = new XMLHttpRequest();

    xhr.addEventListener('load', xhrLoadHandler);
    // Слушаем событие ошибки XHR
    xhr.addEventListener('error', xhrErrorHandler);
    // Слушаем событие таймаута связи
    xhr.addEventListener('timeout', xhrTimeoutHandler);

    xhr.timeout = window.appSettings.xhrSettings.timeout;

    console.log('------- xhr request -------');
    console.log(window.appSettings.xhrSettings.urlApi + parameters.url);
    console.log(parameters.data);
    console.log('---------------------------');

    xhr.open(parameters.metod, window.appSettings.xhrSettings.urlApi + parameters.url, true);
    xhr.send(parameters.data);
    // };

    // xhrRun();
  }
};
