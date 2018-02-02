import auth from '../tools/storage.js';
import groupEdit from './catalog-groups-edit.js';

const groupsEditForm = document.querySelector('#groups-edit');
const groupsEditName = document.querySelector('#groups-edit-name');

const onListGroupsCardBodyClickEdit = (evt) => {
  let currentStringElement = evt.target;
  while (!currentStringElement.dataset.groupIndex) {
    currentStringElement = currentStringElement.parentNode;
  }
  $(groupsEditForm).modal('show');
  groupsEditName.value = currentStringElement.dataset.groupName;

  auth.currentGroupId = currentStringElement.dataset.groupId;
  auth.currentGroupName = currentStringElement.dataset.groupName;
  groupEdit.start(groupsEditForm);
};

export default {
  handler: onListGroupsCardBodyClickEdit
};
