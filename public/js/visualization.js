
function createBall (tam, posX, posY, color) {
  const ball = document.createElement('div');
  ball.classList.add('viz_ball');
  ball.style.width = tam + 'px';
  ball.style.height = tam + 'px';
  ball.style.top = posY + 'px';
  ball.style.left = posX + 'px';
  ball.style.backgroundColor = color;

  var tl = gsap.timeline({});
  tl.to(ball, { scale: 2, opacity: 1, duration: .1 });
  tl.to(ball, { scale: 1, opacity: .2, duration: 1 });
  tl.pause();

  function pulse () {
    tl.play(0);
  }

  return {
    elem: ball,
    pulse,
  };
}