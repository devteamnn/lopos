export default {

  // рассчитывает процент по стоимости и цене
  calcPercent(purchase, price) {
    return ((price - purchase) * 100 / purchase).toFixed(2);
  },
  // рассчитывает цену по стоимости и проценту
  calcPrice(purchase, percent) {
    return (Number(purchase) + (purchase / 100 * percent)).toFixed(2);
  }
};
