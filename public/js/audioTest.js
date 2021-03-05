var drums = null;

window.AudioContext = window.AudioContext ||
window.webkitAudioContext;

var context = new AudioContext();;

function loadDrumSound(url){

    fetch("/test-audio-files/drums.wav").then((res) => {
        return res.arrayBuffer();
    }).then((res) => {
        
        context.decodeAudioData(res, function(buffer) {
            drums = buffer;

            var source = context.createBufferSource(); // creates a sound source
            source.buffer = buffer;                    // tell the source which sound to play
            source.connect(context.destination);       // connect the source to the context's destination (the speakers)
            //console.log(context.sampleRate);
            const analyser = context.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Float32Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            console.log(dataArray)
            //for (var i = 0; i < bufferLength; i++) {}
         }, console.log);
    });
    
    
}

window.addEventListener('load', loadDrumSound, false);

function getPeaksAtThreshold(data, threshold) {
    var peaksArray = [];
    var length = data.length;
    
    for(var i = 0; i < length;) {
      if (data[i] > threshold) {
        peaksArray.push(i);
        // Skip forward ~ 1/4s to get past this peak.
        i += 10000;
      }
      i++;
    }
    return peaksArray;
  }

  const audioCtx = new AudioContext();

//Create audio source
//Here, we use an audio file, but this could also be e.g. microphone input
const audioEle = new Audio();
audioEle.src = "/test-audio-files/drums.wav";//insert file name here
audioEle.autoplay = false;
audioEle.preload = 'auto';
const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

//Create analyser node
const analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 256;
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);

//Set up audio node network
audioSourceNode.connect(analyserNode);
analyserNode.connect(audioCtx.destination);

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

function draw() {
  //Schedule next redraw
  requestAnimationFrame(draw);

  //Get spectrum data
  analyserNode.getFloatFrequencyData(dataArray);

  //Draw black background
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  //Draw spectrum
  const barWidth = (canvas.width / bufferLength) * 2.5;
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  const avg = sum/dataArray.length;

  if(avg > -70) console.log(avg);
  /* let height = 0;
  const barHeight = (dataArray[i] + 140) * 6;
    canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
    canvasCtx.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    posX += barWidth + 1; */
};

draw();