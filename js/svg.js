const [ viewSvg, interactionSvg ] = document.querySelectorAll('.content__svg');
const contentInner = document.querySelector('.content__inner');

const width = contentInner.clientWidth;
const height = contentInner.clientHeight;
interactionSvg.setAttribute('width', width);
interactionSvg.setAttribute('height', height);
interactionSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
interactionSvg.style.opacity = 0;
viewSvg.setAttribute('width', width);
viewSvg.setAttribute('height', height);
viewSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

let newPath = null;
const lineInfo = {
  x: 0,
  y: 0,
  size: 0
};

interactionSvg.addEventListener('mousedown', (event) => {
  newPath = document.createElement('path');
  console.log(event)
  newPath.setAttribute('d', `M${event.offsetX} ${event.offsetY}`);
  newPath.setAttribute('stroke', `black`);
  newPath.setAttribute('stroke-width', `3`);
  newPath.setAttribute('stroke-linejoin', 'round');
  interactionSvg.appendChild(newPath);
  lineInfo.x = event.offsetX;
  lineInfo.y = event.offsetY;
});

interactionSvg.addEventListener('mouseup', () => {
  const size = lineInfo.size;
  newPath.style.strokeDasharray = size;
  newPath.style.strokeDashoffset = 0;
  viewSvg.innerHTML = interactionSvg.innerHTML;
  newPath = null;
  lineInfo.x = 0;
  lineInfo.y = 0;
  lineInfo.size = 0;

  const path = viewSvg.querySelector('path');
  path.style.transition = 'all .7s ease-in-out';
  let toggle = false;
  setInterval(() => {
    toggle = !toggle;
    path.style.strokeDashoffset = toggle ? size : 0;
  }, 700);
});

interactionSvg.addEventListener('mousemove', (event) => {
  if(!newPath) return;
  newPath.setAttribute('d', `${newPath.getAttribute('d')}L${event.offsetX} ${event.offsetY}`);
  viewSvg.innerHTML = interactionSvg.innerHTML;
  const size = Math.sqrt(Math.pow(event.offsetX - lineInfo.x, 2) + Math.pow(event.offsetY - lineInfo.y, 2));
  lineInfo.x = event.offsetX;
  lineInfo.y = event.offsetY;
  lineInfo.size += size;
  
});