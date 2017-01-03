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
  document.body.style.background='black';
})
