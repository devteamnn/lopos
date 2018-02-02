// удаление группы
import xhr from '../tools/xhr.js';
import auth from '../tools/storage.js';
import toolsMarkup from '../markup/tools.js';
import groups from './catalog-groups.js';

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

const onListGroupsCardBodyClickRemove = (evt) => {
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.groupIndex) {
    currentStringElement = currentStringElement.parentNode;
  }
  auth.currentGroupId = currentStringElement.dataset.groupId;
  auth.currentGroupName = currentStringElement.dataset.groupName;

  if (+currentStringElement.dataset.groupLevel >= 9000) {
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
  handler: onListGroupsCardBodyClickRemove
};
