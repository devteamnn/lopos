const validityRelations = {
  'balance-amount': {
    pattern: /(^\d+$)|(^\d+[.]\d+$)/,
    message: 'денежный формат<br>( 000, 000.000 )'
  },
  'balance-set-describe': {
    pattern: /^[а-яёА-ЯЁA-Za-z\s\d\.\,\:\;]{0,300}$/,
    message: 'Не более 300 символов со знаками препинания (. , : ;) без спецсимволов'
  },
  'universal-modal-micro-name': {
    pattern: /^\-?\d+$/,
    message: 'Целое число (0 удалит карточку)'
  },
  'change-password': {
    pattern: /^[а-яёА-ЯЁA-Za-z0-9\s\d]{2,20}$/,
    message: 'От 2-х до 20 символов без спецсимволов'
  },
  'change-user-name': {
    pattern: /^[а-яёА-ЯЁA-Za-z0-9\s\d]{2,20}$/,
    message: 'От 2-х до 20 символов без спецсимволов'
  },


};

export default {
  check(fields, presetNames) {
    const result = [];
    fields.forEach((field, i) => {
      let relationType = presetNames[i] || field.id;
      field.nextElementSibling.innerHTML = !validityRelations[relationType].pattern.test(field.value) ? validityRelations[relationType].message : '';
      result.push(validityRelations[relationType].pattern.test(field.value));
    });
    return result.every((item) => item);
  }
};
