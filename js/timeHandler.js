const timeRail = document.querySelector('.time-line__rail');
const timeHandler = document.querySelector('.time-line__rail-handler');
const timeFill = document.querySelector('.time-line__fill');

let isMousePressed = false; 
timeHandler.addEventListener('mousedown', () => {
  isMousePressed = true; 
}); 

window.addEventListener('mousemove', (event) => {
  if(!isMousePressed)return; 
  let railWidth = timeRail.offsetWidth; 
  let mousePos = event.clientX - timeRail.offsetLeft;
  let percentage = mousePos/railWidth;
  percentage = percentage < 0 ? 0 : percentage > 1 ? 1 : percentage;
  console.log(percentage);

  timeFill.style.width =  `${percentage*100}%` ;  
  console.log('pressed and moving around'); 
})

window.addEventListener('mouseup', () => {
  isMousePressed = false; 
})