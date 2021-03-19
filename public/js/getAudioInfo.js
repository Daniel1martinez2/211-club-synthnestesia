const getAudioInfo = (src) => {
  const audioCtx = new AudioContext();
  //Create audio source
  //Here, we use an audio file, but this could also be e.g. microphone input
  const elem = new Audio();
  elem.src = src;//insert file name here
  // elem.autoplay = true;
  elem.loop = true;
  elem.preload = 'auto';
  const audioSourceNode = audioCtx.createMediaElementSource(elem);
  //Create analyser node
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32;
  const length = analyser.frequencyBinCount;
  const data = new Float32Array(length);
  //Set up audio node network
  audioSourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  return {
    analyser,
    data,
    length,
    elem,
  };
}