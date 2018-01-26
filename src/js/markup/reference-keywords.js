const listKeywordsHeader = document.querySelector('#list-keywords-header');
const listKeywordsBody = document.querySelector('#list-keywords-body');
const listKeywordsCard = document.querySelector('#list-keywords-card');
const listKeywordsCardEdit = document.querySelector('#list-keywords-card-edit');
import auth from '../tools/storage.js';

export default {

  cleanContainer() {
    listKeywordsBody.innerHTML = '';
  },

  getElement(item) {

    return `
      <h3 style="display: inline-block;"><span class="badge keyword-row" style="background-color: #${item.color}; cursor: pointer; color: #fff">#${item.name}</span></h3>`;
  },

  drawDataInContainer(keywordsData) {
    keywordsData.forEach((item) => {
      listKeywordsBody.insertAdjacentHTML('beforeend', this.getElement(item));

      listKeywordsBody.lastChild.addEventListener('click', function () {
        listKeywordsHeader.classList.add('d-none');
        listKeywordsHeader.classList.remove('d-flex');
        listKeywordsBody.classList.add('d-none');
        listKeywordsCard.classList.remove('d-none');
        listKeywordsCardEdit.innerHTML = `<div class="text-center"><button type="button" class="btn btn-lg text-white" style="background-color: #${item.color}"><h3>#${item.name}</h3></button></div>`;
        console.log(item.id);
        auth.currentKeywordId = item.id;
        auth.currentKeywordName = item.name;
        console.log(auth.currentKeywordId);
      });

    });
  },

  drawMarkupInContainer(markup) {
    listKeywordsBody.insertAdjacentHTML('beforeend', markup);
  },

};
