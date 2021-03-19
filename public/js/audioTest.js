window.addEventListener('load', () => {
  const controlsPlay = document.querySelector('.controls__play');
  const eqTabs = document.querySelectorAll('.eq__tab');

  const ball1 = createBall(50, 300, 500, 'aqua');
  document.body.appendChild(ball1.elem);

  const ball2 = createBall(100, 200, 600, 'bisque');
  document.body.appendChild(ball2.elem);
  
  const { process, toggle, changeSound } = setupHistogram();

  const callback = () => {
    console.log('touch');
    ball1.pulse();
    ball2.pulse();
  }

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);
    process(callback);
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