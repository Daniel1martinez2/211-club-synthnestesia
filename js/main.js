window.addEventListener('load', () => {

  const content = document.querySelector('.content');
  const contentInner = document.querySelector('.content__inner');
  const animMenu = document.querySelector('.anim-menu');
  const shapeMenu = document.querySelector('.shape-menu');
  const shapeMenuSize = shapeMenu.querySelector('.shape-menu__item-size');
  const shapeMenuColors = shapeMenu.querySelectorAll('.shape-menu__colors *');

  const newShapePos = {
    x: 0,
    y: 0
  };

  let selectedShape = null;

  const handlerAnimMenu = (event) => {
    event.preventDefault();
    shapeMenu.classList.add('shape-menu--hidden');
    animMenu.classList.remove('anim-menu--hidden');
    animMenu.style.top = `${event.y}px`;
    animMenu.style.left = `${event.x}px`;
    newShapePos.x = event.offsetX;
    newShapePos.y = event.offsetY;
  }
  content.addEventListener('contextmenu', handlerAnimMenu);

  const repositionShapeMenu = (size) => {
    shapeMenu.style.transform = `translate(-50%, calc(-100% - ${size / 2 + 17}px))`;
  }

  const createShape = (shapeType, size, color, pos) => {
    let newShape;
    switch (shapeType) {
      case 0:
        newShape = createBall();
        break;
      case 1:
      default:
        break;
    }

    newShape.setSize(size);
    newShape.setColor(color);
    newShape.setPos(pos.x, pos.y);
    contentInner.appendChild(newShape.elem);
    const shapeIndex = shapes.length;

    const selectShape = () => {
      changeShape(shapeIndex);
      selectedShape = newShape;
      shapes.forEach(s => s.elem.classList.remove('selected'));
      newShape.elem.classList.add('selected');
      activateTrackItem(selectedShape.variables.sound);
    }
    newShape.elem.addEventListener('click', selectShape);

    //create right click event, which is another menu that modify the shape 
    newShape.elem.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectShape();
      shapeMenuSize.value = newShape.variables.size;
      shapeMenu.classList.remove('shape-menu--hidden');
      shapeMenu.style.top = `${newShape.variables.y}px`;
      shapeMenu.style.left = `${newShape.variables.x}px`;
      repositionShapeMenu(newShape.variables.size);
    });
    shapes.push(newShape);
  }

  animMenu.querySelectorAll('button').forEach((item, index) => {
    item.addEventListener('click', () => {
      createShape(index, 50, 'black', newShapePos);
    });
  });

  window.addEventListener('click', () => {
    animMenu.classList.add('anim-menu--hidden');
    shapeMenu.classList.add('shape-menu--hidden');
  });

  shapeMenuSize.addEventListener('input', (event) => {
    selectedShape.setSize(parseInt(event.target.value));
    repositionShapeMenu(selectedShape.variables.size);
  });

  shapeMenuColors.forEach(color => {
    color.addEventListener('click', () => {
      selectedShape.setColor(color.style.backgroundColor);
    });
  })

  const controlsPlay = document.querySelector('.controls__play');

  const shapes = [];
  const sounds = [];

  const activateTrackItem = (trackItemIndex) => {
    document.querySelector('.tracks__item--active')?.classList.remove('tracks__item--active');
    document.querySelector(`.tracks__item:nth-child(${trackItemIndex + 1})`)?.classList.add('tracks__item--active');
  }

  let db;
  //stuff
  let request = indexedDB.open('testPics', 1);

  request.onerror = function(e) {
    console.error('Unable to open database.');
  }

  request.onsuccess = function(e) {
    db = e.target.result;
    console.log('db opened');


    let trans = db.transaction(['cachedForms'], 'readonly');

    let req = trans.objectStore('cachedForms').get(4);
    req.onsuccess = function(e) {
      let record = e.target.result;
      console.log('get success', (record.data));
      const sound = getAudioInfo({ url: record.data, name: 'ásdasda' })
      console.log(sound);
sounds.push(sound)
      //sound.elem.play();
      //const file = new Blob(new Uint8Array(record.data));
      //console.log(file)
      
      //image.src = 'data:image/jpeg;base64,' + btoa(record.data);
    }
  }

  request.onupgradeneeded = function(e) {
    let db = e.target.result;
    db.createObjectStore('cachedForms', {keyPath:'id', autoIncrement: true});
    dbReady = true;
  }


  // aquí estamos haciendo el proceso de cargar archivos y añadiéndolo a sounds
  const Blob = window.URL || window.webkitURL;
  const tracks = document.querySelector('.tracks');
  const fileInput = document.querySelector('.tracks input');

  fileInput.addEventListener('change', (event) => {
    const file = fileInput.files[0];
    const fileURL = Blob.createObjectURL(file);
    createSound({ url: fileURL, name: file.name }); 

    var reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onload = function(e) {
      //alert(e.target.result);
      let bits = e.target.result;
      let ob = {
        created:new Date(),
        data:bits
      };

      let trans = db.transaction(['cachedForms'], 'readwrite');
      let addReq = trans.objectStore('cachedForms').add(ob);

      addReq.onerror = function(e) {
        console.log('error storing data');
        console.error(e);
      }

      trans.oncomplete = function(e) {
        console.log('data stored');
      }
    }
  });
  //creat sounds >>>>>>
  const createSound = ({ url, name }) => {
    if(!url || !name) return;
    const sound = getAudioInfo({ url, name });
    const index = sounds.length;
    sounds.push(sound);
    setVolume(); 

    sounds.forEach(({ elem }) => elem.currentTime = 0);

    const trackItem = document.createElement('button');
    trackItem.classList.add('tracks__item');
    trackItem.innerText = name;
    tracks.insertBefore(trackItem, fileInput.parentNode);

    trackItem.addEventListener('click', () => {
      changeSound(index);
      activateTrackItem(index);
    });
  }


  const volumeRange = document.querySelector('.controls__volume'); 
  const setVolume = () => {
    sounds.forEach((sound) => {
      sound.elem.volume = volumeRange.value; 
    })
  }

  volumeRange.addEventListener('input', setVolume);

  const {
    process,
    toggle,
    changeSound,
    changeShape
  } = setupHistogram(shapes, sounds);

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);
    process();
  };

  draw();

  function updateLocalStorage() {
    const soundURLs = sounds.map(({ url, name }) => ({ url, name }));
    const shapesVariables = shapes.map(({ variables }) => variables);

    localStorage.setItem('shapes', JSON.stringify(shapesVariables));
    localStorage.setItem('soundURLs', JSON.stringify(soundURLs));
  }
  //recreating the localStorage data
  function recreateFromLocalStorage() {
    const shapesFromLS = localStorage.getItem('shapes');
    const soundURLsFromLS = localStorage.getItem('soundURLs'); 
    if (shapesFromLS) {
      const shapesVariables = JSON.parse(shapesFromLS);
      shapesVariables.forEach(variables => {
        createShape(0, variables.size, variables.color, variables);
      });
    }
    if(soundURLsFromLS){
      const soundURLs = JSON.parse(soundURLsFromLS); 
      //paso la función de esa manera, porque el primer elemento que el forEach dá es el objeto iterado
      soundURLs.forEach(createSound); 
    }
  }
  recreateFromLocalStorage();

  window.addEventListener('click', updateLocalStorage);

  const playImg = document.querySelector('.playimg');
  const pauseImg = document.querySelector('.pauseimg');
  controlsPlay.addEventListener('click', () => {
    if (toggle()) {
      playImg.style.display = 'block';
      pauseImg.style.display = 'none';
      fileInput.parentElement.classList.add('tracks__item--disabled');
    } else {
      playImg.style.display = 'none';
      pauseImg.style.display = 'block';
      fileInput.parentElement.classList.remove('tracks__item--disabled');
    }
  });
});