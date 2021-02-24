const searchBar = document.querySelector('.search__bar');
const searchBtn = document.querySelector('.search__btn');

searchBtn.addEventListener('click', (event) => {
  const name = searchBar.value;
  const options = {
    headers: {
      token: 'loremcdjopejw'
    }
  };
  fetch(`/api/search?songName=${name}`, options).then(raw => {
    return raw.json();
  }).then(list => {
    console.log(list);
  }).catch(err => {
    console.log('mmmmmm');
  });
});