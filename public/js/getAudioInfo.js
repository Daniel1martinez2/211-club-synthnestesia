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