function setupHistogram () {
  const canvas = document.querySelector('.eq__canvas');
  const canvasCtx = canvas.getContext('2d');

  const sounds = [ 'vocals', 'drums', 'other', 'bass' ].map(sound => getAudioInfo(`/test-audio-files/${sound}.wav`));
  const colors = [ '#0FA958', '#F24E1E', '#5551FF', '#FFC700' ];

  
  let selectedSound = 0;

  function process (callback) {
    const { analyser, data, length } = sounds[selectedSound];

    window.addEventListener('keydown', ({ key }) => {
      switch(key) {
        case 'ArrowRight':
          barSelected += 1;
          if(barSelected >= length) barSelected = 0;
          break;
        case 'ArrowLeft':
          barSelected -= 1;
          if(barSelected < 0) barSelected = length - 1;
          break;
        case 'ArrowUp':
          threshold += 1;
          break;
        case 'ArrowDown':
          threshold -= 1;
          break;
      }
    });

    //Get spectrum data
    analyser.getFloatFrequencyData(data);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw spectrum
    const barWidth = (canvas.width / length);

    const getHeight = (n) => (n + 90) * 2;

    for (let i = 0; i < length; i++) {
      const barHeight = getHeight(data[i]);
      canvasCtx.fillStyle = i === barSelected ? 'rgb(220,220, 220)' : colors[selectedSound];
      canvasCtx.fillRect(barWidth * i, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    }

    canvasCtx.fillStyle = 'rgb(40, 250, 30)';
    canvasCtx.fillRect(barSelected * barWidth, canvas.height - getHeight(threshold) / 2, barWidth, 2);

    if(data[barSelected] >= threshold && Date.now() - lastTouch > 200) {
      lastTouch = Date.now();
      callback();
    }
  }

  let isPlaying = false;
  function toggle () {
    sounds.forEach(sound => !isPlaying ? sound.elem.play() : sound.elem.pause());
    isPlaying = !isPlaying;
    return isPlaying;
  }

  function changeSound (index) {
    selectedSound = index;
  }

  return {
    process,
    toggle,
    changeSound,
  }
}