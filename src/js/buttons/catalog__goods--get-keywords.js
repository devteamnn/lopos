import auth from '../tools/storage.js';
import goods from './catalog__goods.js';
import xhr from '../tools/xhr.js';

import keywordsUniversal from './universal-keywords.js';
import referenceKeywords from './reference__keywords.js';
import goodFormEdit from './catalog__goods--edit.js';


const goodsKeywords = document.querySelector('#goods-keywords');
const goodsCardKeywordsBody = document.querySelector('#goods-card-keywords-body');
const goodsCardKeywordsModal = document.querySelector('#goods-card-keywords');
const goodsCard = document.querySelector('#goods-card');

let goodTags = [];

// обработчик клика по ключевому слову (пока внутри карточки связей "товар-слово")
const onKeywordClick = (evt) => {
  let clickedKeywordNode = evt.target;
  const onSuccessKeywordsCompare = (keywordNode) => clickedKeywordNode.classList.toggle('keyword__mute');
  let xhrType = (goodTags.every((tagItem) => (tagItem.id !== clickedKeywordNode.dataset.keywordId))) ? 'POST' : 'DELETE';
  xhr.request = {
    metod: xhrType,
    url: `lopos_directory/${auth.data.directory}/operator/1/business/${auth.data.currentBusiness}/tag/${clickedKeywordNode.dataset.keywordId}/compare_meta`,
    data: `good=${auth.currentGoodId}&token=${auth.data.token}`,
    callbackSuccess: onSuccessKeywordsCompare,
  };
};

// установка прозрачности
const keywordModificator = (keywordId, keywordNode) => {
  if (goodTags.every((tagItem) => (tagItem.id !== keywordId))) {
    keywordNode.classList.add('keyword__mute');
  }
};

$(goodsCardKeywordsModal).on('shown.bs.modal', () => {
  auth.isGoodCardEdit = true;
  keywordsUniversal.downloadAndDraw(goodsCardKeywordsBody, onKeywordClick, keywordModificator);
  $(goodsCard).modal('hide');
  goodFormEdit.removeHandlers();
});

$(goodsCardKeywordsModal).on('hidden.bs.modal', () => {
  goods.fill();
});

const getKeywords = (tags) => {

  goodTags = tags;

  const onGoodKeywordClick = (evt) => {
    auth.isGoodCardEdit = true;
    const returnHandler = (e) => {
      goods.fill();
      $('#list-groups-list').tab('show');
      $('#goods-card').modal('show');
      e.target.removeEventListener('click', returnHandler);
    };
    referenceKeywords.showKeywordEdit(evt, returnHandler);
    $('#goods-card').modal('hide');
    $('#list-keywords-list').tab('show');
  };


  console.log(goodsKeywords);
  goodsKeywords.innerHTML = '';
  if (goodTags.length) {
    goodTags.forEach((item) => keywordsUniversal.getDataAndDraw(goodsKeywords, onGoodKeywordClick, item));
  } else {
    goodsKeywords.innerHTML = 'Ключевых слов нет';
  }

};

export default {
  getKeywords
};
