function setupHistogram (shapes) {
  const canvas = document.querySelector('.eq__canvas');
  const canvasCtx = canvas.getContext('2d');

  const sounds = [ 'vocals', 'drums', 'other', 'bass' ].map(sound => getAudioInfo(`/test-audio-files/${sound}.wav`));
  const colors = [ '#0FA958', '#F24E1E', '#5551FF', '#FFC700' ];

  let selectedShape = -1;

  window.addEventListener('keydown', ({ key }) => {
    if(!shapes[selectedShape]) return;
    const bs = shapes[selectedShape].barSelected;
    const length = sounds[shapes[selectedShape].sound].length;
    switch(key) {
      case 'ArrowRight':
        shapes[selectedShape].barSelected += 1;
        if(bs >= length) shapes[selectedShape].barSelected = 0;
        break;
      case 'ArrowLeft':
        shapes[selectedShape].barSelected -= 1;
        if(bs < 0) shapes[selectedShape].barSelected = length - 1;
        break;
      case 'ArrowUp':
        shapes[selectedShape].threshold += 1;
        break;
      case 'ArrowDown':
        shapes[selectedShape].threshold -= 1;
        break;
    }
  });

  function process () {
    sounds.forEach((currentSound, soundIndex) => {
      const { analyser, data, length } = currentSound;

      //Get spectrum data
      analyser.getFloatFrequencyData(data);

      const { barSelected, threshold, sound } = shapes[selectedShape] || {};
      if(soundIndex === sound) {
        // only draw info of selected sound and selected shape
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / length);
        const getHeight = (n) => (n + 90) * 2;
        for (let i = 0; i < length; i++) {
          const barHeight = getHeight(data[i]);
          canvasCtx.fillStyle = i === barSelected ? 'rgb(220,220, 220)' : colors[sound];
          canvasCtx.fillRect(barWidth * i, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        }
        canvasCtx.fillStyle = 'rgb(40, 250, 30)';
        canvasCtx.fillRect(barSelected * barWidth, canvas.height - getHeight(threshold) / 2, barWidth, 2);
      }

      // we need to process all shapes and animate, regarless if it's selected or not
      shapes.forEach(shape => {
        if(soundIndex === shape.sound // if current sound data is same as sound selected for this shape
          && data[shape.barSelected] >= shape.threshold // if current volume is greater than or equals as threshold
          && Date.now() - shape.lastTouch > 200) { // if last touch was 200 or more milliseconds ago
          shape.lastTouch = Date.now();
          shape.pulse();
        }
      });
    });
  }

  let isPlaying = false;
  function toggle () {
    sounds.forEach(sound => !isPlaying ? sound.elem.play() : sound.elem.pause());
    isPlaying = !isPlaying;
    return isPlaying;
  }

  function changeSound (index) {
    if(!shapes[selectedShape]) return;
    shapes[selectedShape].sound = index;
  }

  function changeShape (index) {
    selectedShape = index;
    selectedSound = shapes[index].sound;
  }

  return {
    process,
    toggle,
    changeSound,
    changeShape,
  }
}