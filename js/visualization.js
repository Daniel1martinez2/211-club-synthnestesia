const getVariables = () => {

  const setTime = (start, end) => {
    if(start < 0) start = 0;
    if(end > 1) end = 1;
    variables.timeStart = start;
    variables.timeEnd = end;
  }

  const variables = {
    barSelected: 0,
    threshold: 0,
    lastTouch: 0,
    sound: 0,
    timeStart: 0,
    timeEnd: 0,
    color: '',
    size: 0,
    x: 0,
    y: 0,
    type: 0,
    setTime,
  };

  return variables;
}

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

  function animate() {
    tl.play(0);
  }

  const variables = getVariables();

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
    animate,
    setSize,
    setColor,
    setPos,
    setTime: variables.setTime,
    variables,
  };
}


function createLine({ path, length }) {
  const anchor = document.createElement('div');
  anchor.classList.add('viz_line_anchor');

  function animate(value) {
    if(value < .06) value = .06;
    if(value > 1) value = 1;
    path.style.strokeDashoffset = length * value;
  }

  const variables = getVariables();

  const setSize = (newSize) => {
    variables.size = newSize;
    path.setAttribute('stroke-width', newSize);
  }

  const setColor = (newColor) => {
    variables.color = newColor;
    path.setAttribute('stroke', newColor);
  }
  
  const setPos = (x, y) => {
    variables.x = x;
    variables.y = y;
    anchor.style.top = y + 'px';
    anchor.style.left = x + 'px';
  }

  variables.type = 1;

  return {
    elem: anchor,
    animate,
    setSize,
    setColor,
    setPos,
    setTime: variables.setTime,
    variables,
  };
}