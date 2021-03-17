function setupHistogram () {
  const { analyserNode, dataArray, bufferLength } = getAudioInfo();
  const { canvasCtx, canvas } = getCanvasInfo();

  let barSelected = 0;
  let threshold = 0;
  let lastTouch = 0;

  window.addEventListener('keydown', ({ key }) => {
    switch(key) {
      case 'ArrowRight':
        barSelected += 1;
        if(barSelected >= bufferLength) barSelected = 0;
        break;
      case 'ArrowLeft':
        barSelected -= 1;
        if(barSelected < 0) barSelected = bufferLength - 1;
        break;
      case 'ArrowUp':
        threshold += 1;
        break;
      case 'ArrowDown':
        threshold -= 1;
        break;
    }
  });

  return function process (callback) {
    //Get spectrum data
    analyserNode.getFloatFrequencyData(dataArray);
  
    //Draw black background
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
    //Draw spectrum
    const barWidth = (canvas.width / bufferLength);

    const getHeight = (n) => (n + 90) * 6;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = getHeight(dataArray[i]);
      canvasCtx.fillStyle = i === barSelected ? 'rgb(255,200, 0)' : 'rgb(220, 50, 50)';
      canvasCtx.fillRect(barWidth * i, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    }

    canvasCtx.fillStyle = 'rgb(40, 250, 30)';
    canvasCtx.fillRect(barSelected * barWidth, canvas.height - getHeight(threshold) / 2, barWidth, 2);

    if(dataArray[barSelected] >= threshold && Date.now() - lastTouch > 200) {
      lastTouch = Date.now();
      callback();
    }
  }
}