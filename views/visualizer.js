document.addEventListener('DOMContentLoaded', () => {
  // this is our audio tag, which plays all the music. You'll probably need it.
  const audio = document.getElementsByTagName('AUDIO')[0]
  // Do some visualizer shit here, I guess.
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  document.body.style.overflow='hidden';
  document.body.style.margin='0';
  document.body.style.background='black';

  //var size_o = 73.66;
  //var size_m = 12.43;
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  //var source = audioCtx.createMediaStreamSource(stream);
  var source = audioCtx.createMediaElementSource(audio);


  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  //analyser.connect(distortion);
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);


  function draw() {

    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * canvas.height/2;

      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
  };

  draw();






})
