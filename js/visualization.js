function createBall() {
  const ball = document.createElement('div');
  ball.classList.add('viz_ball');

  var tl = gsap.timeline({});
  tl.to(ball, {
    scale: 2,
    opacity: 1,
    duration: .1
  });
  tl.to(ball, {
    scale: 1,
    opacity: .2,
    duration: 1
  });
  tl.pause();

  function pulse() {
    tl.play(0);
  }

  const variables = {
    barSelected: 0,
    threshold: 0,
    lastTouch: 0,
    sound: 0,
    start: 0,
    end: 0,
    color: '',
    size: 0,
    x: 0,
    y: 0,
  }

  const setSize = (newSize) => {
    variables.size = newSize;
    ball.style.width = variables.size + 'px';
    ball.style.height = variables.size + 'px';
  }

  const setColor = (newColor) => {
    variables.color = newColor;
    ball.style.backgroundColor = newColor;
  }
  
  const setPos = (x, y) => {
    variables.x = x;
    variables.y = y;
    ball.style.top = y + 'px';
    ball.style.left = x + 'px';
  }

  return {
    elem: ball,
    pulse,
    setSize,
    setColor,
    setPos,
    variables,
  };
}