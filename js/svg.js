const svg = document.querySelector('.content__svg');
const contentInner = document.querySelector('.content__inner');

const width = contentInner.clientWidth;
const height = contentInner.clientHeight;
svg.setAttribute('width', width);
svg.setAttribute('height', height);
svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

let newPath = null;
const lineInfo = {
  x: 0,
  y: 0,
  size: 0,
  initX: 0,
  initY: 0,
};

let allowDraw = false;

svg.addEventListener('mousedown', (event) => {
  if(!allowDraw) return;
  newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  console.log(event)
  newPath.setAttribute('d', `M${event.offsetX} ${event.offsetY}`);
  newPath.setAttribute('stroke', `black`);
  newPath.setAttribute('stroke-width', `3`);
  newPath.setAttribute('stroke-linejoin', 'round');
  newPath.setAttribute('stroke-linecap', 'round');
  svg.appendChild(newPath);
  lineInfo.x = event.offsetX;
  lineInfo.y = event.offsetY;
  lineInfo.initX = event.offsetX;
  lineInfo.initY = event.offsetY;
});

const releaseMouse = () => {
  if(!allowDraw || !newPath) return;
  allowDraw = false;
  document.querySelector('.content').classList.remove('content--drawing'); 
  const size = lineInfo.size;
  newPath.style.strokeDasharray = size;
  newPath.style.strokeDashoffset = 0;
  
  const extra = {
    path: newPath,
    length: size,
  }
  createShape(1, 3, 'black', { x: lineInfo.initX, y: lineInfo.initY }, extra);
  newPath = null;
  lineInfo.x = 0;
  lineInfo.y = 0;
  lineInfo.initX = 0;
  lineInfo.initY = 0;
  lineInfo.size = 0;
};

svg.addEventListener('mouseup', releaseMouse);

svg.addEventListener('mousemove', (event) => {
  if(!newPath) return;
  newPath.setAttribute('d', `${newPath.getAttribute('d')}L${event.offsetX} ${event.offsetY}`);
  const size = Math.sqrt(Math.pow(event.offsetX - lineInfo.x, 2) + Math.pow(event.offsetY - lineInfo.y, 2));
  lineInfo.x = event.offsetX;
  lineInfo.y = event.offsetY;
  lineInfo.size += size;
  
  if(lineInfo.size > 500) {
    releaseMouse();
  }
});