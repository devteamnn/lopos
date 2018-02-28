export default {

  // рассчитывает процент по стоимости и цене
  calcPercent(purchase, price) {
    let precent = ((price - purchase) * 100 / purchase).toFixed(2);

    if (!isFinite(precent)) {
      return 0;
    }

    return precent;
  },
  // рассчитывает цену по стоимости и проценту
  calcPrice(purchase, percent) {
    return (Number(purchase) + (purchase / 100 * percent)).toFixed(2);
  },

  // setup = {
  //   array: массив в котором искать
  //   property: свойство объекта (когда массив состоит из объектов). Если пустое, то ищется по массиву
  //   el: что искать
  //   strict: true/false - если true, то ищет значение целиком, если false - вхождение
  // }
  serachElements(setup) {
    let indexes = [];

    setup.array.forEach((good) => {
      let el1 = (setup.property) ? good[setup.property].toLocaleLowerCase() : good.toLocaleLowerCase();
      let el2 = setup.el.toLocaleLowerCase();

      if (setup.strict) {
        if (el1 === el2) {
          indexes.push(good);
        }
      } else {
        if (el1.indexOf(el2) !== -1) {
          indexes.push(good);
        }
      }
    });

    if (indexes.length === 0) {
      return 'none';
    }
    return indexes;
  },

};
