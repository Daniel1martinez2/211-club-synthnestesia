const searchBar = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const resultContainer = document.querySelector('.result');
//estas son las ya seleccionadas
const songsContainer = document.querySelector('.main__songs-container');

searchBtn.addEventListener('click', (event) => {
  const name = searchBar.value;
  fetch(`/api/search?songName=${name}`).then(raw => {
    return raw.json();
  }).then(list => {
    resultContainer.innerHTML = '';
    list.forEach(obj => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultItem.innerHTML = ` 
      <div class="result-item-content">
        <img  src="${obj.url}" class="result-item-content-img">
        <div class="result-item-content-text">
          <p>${obj.title.length > 12 ? obj.title.substring(0,12)+'...' : obj.title}</p>
        </div>
      </div>`;
      resultContainer.appendChild(resultItem);
      const clickHandler = () => {

        resultItem.removeEventListener('click', clickHandler);
        const id = obj.id;
        songsContainer.appendChild(resultItem);
        resultItem.classList.add('result-item--vertical');
        resultItem.classList.add('result-item--wait');
        resultContainer.innerHTML = '';
        searchBar.value = '';
        //siempreeeeeeeeeee un .then y raw luego de un fetch
        fetch(`/api/download?id=${id}`).then(raw => {
          return raw.json();
        }).then(sound => {
          resultItem.classList.remove('result-item--wait');
        });
      }
      resultItem.addEventListener('click', clickHandler)
    });
    console.log(list);
  }).catch(err => {
    console.log('mmmmmm');
  });
});