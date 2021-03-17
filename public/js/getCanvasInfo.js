const getCanvasInfo = () => {
  //Create 2D canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  return {
    canvasCtx,
    canvas,
  }
}