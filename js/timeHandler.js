const timeRail = document.querySelector('.time-line__rail');
const timeFill = document.querySelector('.time-line__fill');

const timeHandlerMain = document.querySelector('.time-line__rail-handler');
const timeHandlerLeft = document.querySelector('.time-line__left');
const timeHandlerRight = document.querySelector('.time-line__right');
const timeHandlerFill = document.querySelector('.time-line__handlers-fill');
const timeHandlerWrapper = document.querySelector('.time-line__shape-handlers');

const timeCurrent = document.querySelector('.time-line__current-time');
const timeLength = document.querySelector('.time-line__lenght');

let isMousePressed = null;
const timeHandlersInfo = {
  left: 0,
  right: .5,
  main: 0,
  duration: 0,
}
const timeHandlerWidth = timeHandlerLeft.offsetWidth;
const railWidth = timeRail.offsetWidth;

timeHandlerMain.addEventListener('mousedown', () => {
  isMousePressed = 'main';
}); 
timeHandlerLeft.addEventListener('mousedown', () => {
  isMousePressed = 'left';
}); 
timeHandlerRight.addEventListener('mousedown', () => {
  isMousePressed = 'right';
}); 

window.addEventListener('mousemove', (event) => {
  if(!isMousePressed)return; 
  let mousePos = event.clientX - timeRail.offsetLeft;
  let percentage = mousePos/railWidth;
  percentage = percentage < 0 ? 0 : percentage > 1 ? 1 : percentage;

  switch(isMousePressed) {
    case 'main':
      timeHandlersInfo.main = percentage;
      updateTimeLineUI(percentage);
      break;
    case 'left':
      if(percentage >= timeHandlersInfo.right) {
        percentage = timeHandlersInfo.right;
      };
      timeHandlersInfo.left = percentage;
      break;
    case 'right':
      if(percentage <= timeHandlersInfo.left) {
        percentage = timeHandlersInfo.left;
      };
      timeHandlersInfo.right = percentage;
      break;
  }

  if(isMousePressed !== 'main') {
    updateTimeHandlerUI(timeHandlersInfo.left, timeHandlersInfo.right);
    selectedShape.setTime(timeHandlersInfo.left, timeHandlersInfo.right);
  }
});

window.addEventListener('mouseup', () => {
  isMousePressed = null; 
});

const updateTimeHandlerUI = (left, right) => {
  timeHandlerWrapper.classList.remove('hidden');
  timeHandlersInfo.left = left;
  timeHandlersInfo.right = right;
  // set left handler position
  timeHandlerLeft.style.transform =  `translate(${left*(railWidth - timeHandlerWidth * 2)}px, 0px)`;
  // set right handler position
  timeHandlerRight.style.transform =  `translate(${right*(railWidth - timeHandlerWidth * 2) + timeHandlerWidth}px, 0px)`;
  // set fill position and width
  timeHandlerFill.style.transform = `translate(${left * (railWidth - timeHandlerWidth * 2) + timeHandlerWidth}px, 0px)`;
  timeHandlerFill.style.width = `${(right - left) * (railWidth - timeHandlerWidth * 2)}px`;
}

const formatTime = (duration) => {
  duration = Math.floor(duration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const updateTimeLineUI = (percentage) => {
  timeFill.style.width =  `${percentage*100}%`;
  const current = timeHandlersInfo.duration * percentage;
  timeCurrent.innerText = formatTime(current);
}

// updateTimeHandlerUI(timeHandlersInfo.left, timeHandlersInfo.right);
updateTimeLineUI(timeHandlersInfo.main);

const updateDuration = (duration) => {
  timeHandlersInfo.duration = duration;
  timeLength.innerText = formatTime(duration);
}