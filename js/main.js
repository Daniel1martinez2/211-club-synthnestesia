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

  animMenu.querySelectorAll('button').forEach((item, index) => {
    item.addEventListener('click', () => {
      let newShape;
      switch (index) {
        case 0:
          newShape = createBall();
          break;
        case 1:
        default:
          break;
      }

      newShape.setSize(50);
      newShape.setColor('black');
      newShape.setPos(newShapePos.x, newShapePos.y);
      contentInner.appendChild(newShape.elem);
      const shapeIndex = shapes.length;
      
      const selectShape = () => {
        changeShape(shapeIndex);
        selectedShape = newShape;
        shapes.forEach(s => s.elem.classList.remove('selected'));
        newShape.elem.classList.add('selected');
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
  const eqTabs = document.querySelectorAll('.eq__tab');

  const shapes = [];

  const {
    process,
    toggle,
    changeSound,
    changeShape
  } = setupHistogram(shapes);

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);
    process();
  };

  draw();

  const playImg = document.querySelector('.playimg');
  const pauseImg = document.querySelector('.pauseimg');
  controlsPlay.addEventListener('click', () => {
    if (toggle()) {
      playImg.style.display = 'block';
      pauseImg.style.display = 'none';
    } else {
      playImg.style.display = 'none';
      pauseImg.style.display = 'block';
    }
  });

  eqTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      changeSound(index);
    });
  })
});