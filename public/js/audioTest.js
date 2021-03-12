const btn = document.createElement('button');
btn.innerText = 'Begin';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
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

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);
  
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
      console.log('touch', dataArray[barSelected]);
    }
  };

  draw();
});


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


const getAudioInfo = () => {
  const audioCtx = new AudioContext();
  //Create audio source
  //Here, we use an audio file, but this could also be e.g. microphone input
  const audioEle = new Audio();
  audioEle.src = "/test-audio-files/drums.wav";//insert file name here
  audioEle.autoplay = true;
  audioEle.loop = true;
  audioEle.preload = 'auto';
  const audioSourceNode = audioCtx.createMediaElementSource(audioEle);
  //Create analyser node
  const analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 32;
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  //Set up audio node network
  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);

  return {
    analyserNode,
    dataArray,
    bufferLength,
  };
}