window.addEventListener('load', () => {

  const content = document.querySelector('.content');
  const animMenu = document.querySelector('.anim-menu');
  const newShapePos = { x: 0, y: 0 };

  content.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    animMenu.classList.remove('anim-menu--hidden');
    animMenu.style.top = `${event.y}px`;
    animMenu.style.left = `${event.x}px`;
    newShapePos.x = event.offsetX;
    newShapePos.y = event.offsetY;
  });

  animMenu.querySelectorAll('button').forEach((item, index) => {
    item.addEventListener('click', () => {
      let newShape;
      switch(index) {
        case 0:
          newShape = createBall(50, newShapePos.x, newShapePos.y, 'aqua');
          break;
        case 1:
        default:
          break;
      }
      content.appendChild(newShape.elem);
      const shapeIndex = shapes.length;
      newShape.elem.addEventListener('click', () => {
        changeShape(shapeIndex);
        shapes.forEach(s => s.elem.classList.remove('selected'));
        newShape.elem.classList.add('selected');
      });
      shapes.push(newShape);
    });
  });

  window.addEventListener('click', () => {
    animMenu.classList.add('anim-menu--hidden');
  });

  const controlsPlay = document.querySelector('.controls__play');
  const eqTabs = document.querySelectorAll('.eq__tab');

  const shapes = [];

  const { process, toggle, changeSound, changeShape } = setupHistogram(shapes);

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);
    process();
  };

  draw();

  const playImg = document.querySelector('.playimg');
  const pauseImg = document.querySelector('.pauseimg');
  controlsPlay.addEventListener('click', () => {
    if(toggle()) {
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