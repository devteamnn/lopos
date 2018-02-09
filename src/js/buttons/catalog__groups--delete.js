// удаление группы
import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import groups from './catalog__groups.js';

const onSuccessGroupDelete = (answer) => {

  let message = '';
  if (answer.status === 271) {
    message = answer.message + ', удалить никак невозможно-с';
  } else {
    message = 'Группа успешно удалена';
    groups.redraw();
  }

  toolsMarkup.informationtModal = {
    title: 'Уведомление',
    message
  };

};

const setRequestToDeleteGroup = () => {
  xhr.request = {
    metod: 'DELETE',
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/group/${auth.currentGroupId}`,
    data: `token=${auth.data.token}`,
    callbackSuccess: onSuccessGroupDelete,
  };
};

const deleteGroup = (evt) => {

  if (+auth.currentGroupLevel >= 9000) {
    toolsMarkup.informationtModal = {
      title: 'Уведомление',
      message: '<b>NO! IT\'S OVER NINE THOUSAAAAAND!!!</b>'
    };
  } else {
    toolsMarkup.actionRequestModal = {
      title: 'Удаление',
      message: `Вы точно хотите удалить группу <b>${auth.currentGroupName}</b>?`,
      submitCallback: setRequestToDeleteGroup
    };
  }
};

export default {
  make: deleteGroup
};
