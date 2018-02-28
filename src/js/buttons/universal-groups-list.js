import auth from '../tools/storage.js';

const markup = {

  getElement(item, index) {
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-group-id="${item.id}" data-group-index="${index}" data-group-level="${item.level}" data-group-name="${item.name}">
      <div style="padding-left: 34px;">
        <span class="reference-row-number">${index + 1}</span>
        <span>${item.name}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center" style="padding-right: 34px;">
        <span> ${(item.count) ? item.count : ''} </span>
      </div>
    </div>`;
  },

  drawDataInContainer(groupsData, container, handler) {
    groupsData.forEach((group, index) => {
      container.insertAdjacentHTML('beforeend', this.getElement(group, index));
      container.lastChild.addEventListener('click', function () {
        auth.currentGroupId = group.id;
        auth.currentGroupName = group.name;
        auth.currentGroupLevel = group.level;
        handler();
      });
    });
  },
};

// отрисовка списка групп по данным
const drawGroups = (groupsList, container, handler) => {
  container.innerHTML = '';
  if (groupsList.length > 0) {
    markup.drawDataInContainer(groupsList, container, handler);
  } else {
    container.innerHTML = 'Списка групп для этого предприятия еще нет';
  }
};

export default {
  draw: drawGroups
};
