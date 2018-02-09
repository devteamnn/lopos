const search = (data, keyword) => {
  let selectedData = [];
  data.forEach((item) => {
    if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
      selectedData.push(item);
    }
  });
  return selectedData;
};

export default {
  make: search
};
