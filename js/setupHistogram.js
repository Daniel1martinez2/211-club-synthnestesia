function setupHistogram (shapes, sounds) {
  const canvas = document.querySelector('.eq__canvas');
  const canvasCtx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  let selectedShape = -1;

  window.addEventListener('keydown', ({ key }) => {
    const shape = shapes[selectedShape];
    if(!shape) return;
    const bs = shape.variables.barSelected;
    const length = sounds[shape.variables.sound].length;
    switch(key) {
      case 'ArrowRight':
        shape.variables.barSelected += 1;
        if(bs >= length) shape.variables.barSelected = 0;
        break;
      case 'ArrowLeft':
        shape.variables.barSelected -= 1;
        if(bs < 0) shape.variables.barSelected = length - 1;
        break;
      case 'ArrowUp':
        shape.variables.threshold += 1;
        break;
      case 'ArrowDown':
        shape.variables.threshold -= 1;
        break;
    }
  });

  function process () {
    
    const maxSound = sounds.find(({ elem }) => elem.duration === timeHandlersInfo.duration);
    if(!maxSound) return;
    updateTimeLineUI(maxSound.elem.currentTime / maxSound.elem.duration)

    sounds.forEach((currentSound, soundIndex) => {
      const { analyser, data, length } = currentSound;

      //Get spectrum data
      analyser.getFloatFrequencyData(data);

      const { barSelected, threshold, sound } = shapes[selectedShape]?.variables || {};
      if(soundIndex === sound) {
        // only draw info of selected sound and selected shape
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / length);
        const getHeight = (n) => (n + 90) * 2;
        for (let i = 0; i < length; i++) {
          const barHeight = getHeight(data[i]);
          canvasCtx.fillStyle = i === barSelected ? 'rgb(220,220, 220)' : '#70709F';
          canvasCtx.fillRect(barWidth * i, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        }
        canvasCtx.fillStyle = 'rgb(40, 250, 30)';
        canvasCtx.fillRect(barSelected * barWidth, canvas.height - getHeight(threshold) / 2, barWidth, 2);
      }

      // we need to process all shapes and animate, regarless if it's selected or not
      shapes.forEach(shape => {
        if(soundIndex === shape.variables.sound){ // if current sound data is same as sound selected for this shape
          const value = data[shape.variables.barSelected];
          switch(shape.variables.type) {
            case 0:
              if(value >= shape.variables.threshold // if current volume is greater than or equals as threshold
                && Date.now() - shape.variables.lastTouch > 200) { // if last touch was 200 or more milliseconds ago
                shape.variables.lastTouch = Date.now();
                shape.animate();
              }
              break;
            case 1:
              shape.animate(map(value, -100, shape.variables.threshold, 1, 0));
              break;
          }
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
    shapes[selectedShape].variables.sound = index;
  }

  function changeShape (index) {
    selectedShape = index;
    selectedSound = shapes[index].variables.sound;
  }

  return {
    process,
    toggle,
    changeSound,
    changeShape,
  }
}