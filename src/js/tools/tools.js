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
  }
};
