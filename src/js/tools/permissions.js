import auth from './storage.js';

// Пользовательские права доступа на чтение в зависимости от кодов
const permissionEngToRus = {

  // операции
  'receipt': 'Операции/Поступление',
  'sell': 'Операции/Продажа',
  'inventory': 'Операции/Инвентаризация',
  'balance': 'Операции/Балансовые операции',
  'manufacture': 'Операции/Производство',

  // каталог
  'groups': 'Каталог/Группы товаров',
  'cards': 'Каталог/Производственные карточки',

  // учет
  'docs': 'Учет/Все документы',
  'reports': 'Учет/Отчеты и аналитика',

  // справочники
  'contractor-suppliers': 'Справочники/Поставщики',
  'contractor-buyers': 'Справочники/Покупатели',
  'points': 'Справочники/Точки продаж',
  'keywords': 'Справочники/Ключевые слова',
  'enterprises': 'Справочники/Предприятия',
  'debit': 'Справочники/Категории доходов',
  'credit': 'Справочники/Категории расходов',

  // журнал
  'log': 'Журнал/Журнал операций'
};

const permissionRead = {

  // операции
  'receipt': 111,
  'sell': 121,
  'inventory': 141,
  'balance': 131,
  'manufacture': 181,

  // каталог
  'groups': 221,
  'cards': 231,

  // учет
  'docs': 321,
  'reports': 331,

  // справочники
  'contractor-suppliers': 411,
  'contractor-buyers': 421,
  'points': 431,
  'keywords': 441,
  'enterprises': 511,
  'debit': 451,
  'credit': 461,

  // журнал
  'log': 541
};

/*
const permissionEdit = {

  // каталог
  'groups': 222,
  'cards': 232,

  // учет
  'docs': 322,

  // справочники
  'contractor-suppliers': 412,
  'contractor-buyers': 422,
  'points': 432,
  'keywords': 442,
  'enterprises': 512,
  'debit': 452,
  'credit': 462,
};
*/

const permissionReadAdminOnly = [
  'users',
  'support'
];


const read = () => {
  if (auth.data.operatorId !== '1') {
    Object.keys(permissionRead).forEach((itemId) => document.querySelector(`#list-${itemId}-list`).classList.remove('disabled'));
    Object.keys(permissionRead).forEach((itemId) => !auth.permissions.includes(permissionRead[itemId]) && document.querySelector(`#list-${itemId}-list`).classList.add('disabled'));
    permissionReadAdminOnly.forEach((itemId) => document.querySelector(`#list-${itemId}-list`).classList.add('disabled'));
  } else {
    Object.keys(permissionRead).forEach((itemId) => document.querySelector(`#list-${itemId}-list`).classList.remove('disabled'));
    permissionReadAdminOnly.forEach((itemId) => document.querySelector(`#list-${itemId}-list`).classList.remove('disabled'));
  }
};

export default {
  read,
  permissionRead,
  permissionEngToRus
};
