window.addEventListener('load', () => {

  const content = document.querySelector('.content');
  const animMenu = document.querySelector('.anim-menu');
  const shapeMenu = document.querySelector('.shape-menu');
  const newShapePos = {
    x: 0,
    y: 0
  };

  const handlerAnimMenu = (event) => {
    event.preventDefault();
    animMenu.classList.remove('anim-menu--hidden');
    animMenu.style.top = `${event.y}px`;
    animMenu.style.left = `${event.x}px`;
    newShapePos.x = event.offsetX;
    newShapePos.y = event.offsetY;
  }
  content.addEventListener('contextmenu', handlerAnimMenu);

  animMenu.querySelectorAll('button').forEach((item, index) => {
    item.addEventListener('click', () => {
      let newShape;
      switch (index) {
        case 0:
          newShape = createBall(50, newShapePos.x, newShapePos.y, 'aqua');
          break;
        case 1:
        default:
          break;
      }
      content.appendChild(newShape.elem);
      const shapeIndex = shapes.length;
      // here im trying hard to discard the prime click event which is handleaninMenu
      //newShape.elem.removeEventListener('click', handlerAnimMenu);
      newShape.elem.addEventListener('click', () => {
        changeShape(shapeIndex);
        shapes.forEach(s => s.elem.classList.remove('selected'));
        newShape.elem.classList.add('selected');
      });
      //create right click event, which is another menu that modify the shape 
      newShape.elem.addEventListener('contextmenu', (event) => {
        shapeMenu.classList.remove('shape-menu--hidden');
        shapeMenu.style.top = `${event.y - 160}px`;
        shapeMenu.style.left = `${event.x -63}px`;
        // console.log({
        //   a: newShape.elem.offsetTop,
        //   b: newShape.elem.offsetLeft
        // });

      });
      shapes.push(newShape);
    });
  });

  window.addEventListener('click', () => {
    animMenu.classList.add('anim-menu--hidden');
    shapeMenu.classList.add('shape-menu--hidden');
  });

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