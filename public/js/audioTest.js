const btn = document.createElement('button');
btn.innerText = 'Begin';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
  const ball1 = createBall(50, 300, 500, 'aqua');
  document.body.appendChild(ball1.elem);

  const ball2 = createBall(100, 200, 600, 'bisque');
  document.body.appendChild(ball2.elem);
  
  const process = setupHistogram();

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
});