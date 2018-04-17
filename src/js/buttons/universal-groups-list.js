
import auth from '../tools/storage.js';

const markup = {

  getElement(item, index) {
    return `
    <div class="catalog-groups-header">
        <div class="catalog-groups-column">${index + 1}</div>
        <div class="catalog-groups-column">${item.name}</div>
        <div class="catalog-groups-column">${(item.count) ? item.count : ''}</div>
    </div>`;
    /*
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
    */
  },

  getElementExtended(item, index) {
    return `
    <div class="catalog-groups-header">
        <div class="catalog-groups-column">${index + 1}</div>
        <div class="catalog-groups-column">${item.name}</div>
        <div class="catalog-groups-column">${item.markup_group}%</div>
        <div class="catalog-groups-column">${(item.count) ? item.count : ''}</div>
        <div class="catalog-groups-column">
          <button type="button" class="btn p-0 icon-btn icon-btn__edit--black"></button>
        </div>
    </div>`;
  },

  getElementReports(item, index) {
    return `
    <div class="d-flex justify-content-between align-items-center reference-string" data-group-id="${item.id}">
      <div style="padding-left: 20px;">
        <span class="reference-row-number">${index + 1}</span>
        <span>${item.name}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center" style="padding-right: 20px;">
        <div><input class="form-check-input position-static report-groups-switch" type="checkbox" value="${item.id}" checked></div>
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

  drawDataInContainerExtended(groupsData, container, handler) {
    groupsData.forEach((group, index) => {
      container.insertAdjacentHTML('beforeend', this.getElementExtended(group, index));
      container.lastChild.addEventListener('click', function (evt) {
        auth.currentGroupId = group.id;
        auth.currentGroupName = group.name;
        auth.currentGroupLevel = group.level;
        auth.currentGroupMarkup = group.markup_group;
        auth.currentGroupCount = group.count;
        handler(evt);
      });
    });
  },

  drawDataInContainerReports(groupsData, container) {
    groupsData.forEach((group, index) => {
      container.insertAdjacentHTML('beforeend', this.getElementReports(group, index));
    });
  },
};

// отрисовка списка групп по данным
const drawGroups = (groupsList, container, handler) => {
  container.innerHTML = `
    <div class="catalog-groups-header">
        <div class="catalog-groups-column">№</div>
        <div class="catalog-groups-column">Наименование</div>
        <div class="catalog-groups-column"></div>
    </div>`;
  if (groupsList.length > 0) {
    markup.drawDataInContainer(groupsList, container, handler);
  } else {
    container.innerHTML = 'Списка групп для этого предприятия еще нет';
  }
};

const drawGroupsWithoutCount = (groupsList, container, handler) => {
  container.innerHTML = `
    <div class="catalog-groups-header">
        <div class="catalog-groups-column">Наименование</div>
        <div class="catalog-groups-column">Наценка</div>
        <div class="catalog-groups-column"></div>
    </div>`;
  if (groupsList.length > 0) {
    markup.drawDataInContainer(groupsList, container, handler);
  } else {
    container.innerHTML = 'Списка групп для этого предприятия еще нет';
  }
};

// расширенная отрисовка списка групп для страницы КАТАЛОГ/ГРУППЫ ТОВАРОВ
const drawGroupsExtended = (groupsList, container, handler) => {
  container.innerHTML = `
    <div class="catalog-groups-header">
        <div class="catalog-groups-column">№</div>
        <div class="catalog-groups-column">Название</div>
        <div class="catalog-groups-column">Наценка</div>
        <div class="catalog-groups-column">Кол-во товаров</div>
        <div class="catalog-groups-column">Ред.</div>
    </div>`;

  if (groupsList.length > 0) {
    markup.drawDataInContainerExtended(groupsList, container, handler);
  } else {
    container.innerHTML = 'Списка групп для этого предприятия еще нет';
  }
};

// отрисовка списка групп по данным
const drawGroupsReports = (groupsList, container, handler) => {
  container.innerHTML = '';
  if (groupsList.length > 0) {
    markup.drawDataInContainerReports(groupsList, container);
  } else {
    container.innerHTML = 'Списка групп для этого предприятия еще нет';
  }
};

export default {
  draw: drawGroups,
  drawSimple: drawGroupsWithoutCount,
  drawCatalog: drawGroupsExtended,
  drawReports: drawGroupsReports,
};
