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
  //console.log(canvas.height);
  //console.log(canvas.width);

  var generation = 0;
  var size_o = 73.66;
  var size_m = 12.43;
  var deg = 35;
  var trees = 1;
  var rot_total=0;

  var forest=[];
  for (var i=0; i<trees; i++) forest.push(new Branch(size_o,0));

  draw();

  function draw() {
    ctx.save();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.translate(0, canvas.height);
    for(var i = 0; i<trees; i++) {
      ctx.translate(canvas.width/(forest.length+1), 0);

      forest[i].render('rgb(255,255,255)');
    }
    ctx.restore();

    window.requestAnimationFrame(draw);
  }

  function Branch(size, rotation) {
    generation++;	var sway = 0,	swaySpeed = random(0.02,0.08), growth = 0, delay = generation*11, lum = 40+(parseFloat(size)/parseFloat(size_o))*60.0,
    hue = random(0,360),	_col = 'hsl('+hue+',100%,' + lum + '%)';

    this.children = [];
    if(size>size_m) this.children.push(new Branch(size*random(0.7,.9), random(5,deg))), this.children.push(new Branch(size*random(0.7,.9), random(-5,-deg)));
    else this.children.push(new Leaf(size*random(0.7,1.5)));

    this.render = function(col) {
      let rot = (rotation+Math.sin(sway)) * Math.PI/180;
      ctx.save();		ctx.rotate(rot);
      rot_total += rot
      var grad = ctx.createLinearGradient(0, 0, 0, -size*growth);		grad.addColorStop(1,String(_col));		grad.addColorStop(0,String(col));		ctx.strokeStyle = grad;
      hue+=random(1,3);		_col = 'hsl('+hue+',100%,' + lum + '%)';
      ctx.beginPath();		ctx.lineWidth = size*0.1*growth;		ctx.moveTo(0,0);		ctx.lineTo(0,-size*growth);		ctx.stroke();
      ctx.translate(0,-size*growth);
      for(var i = 0; i<this.children.length; i++) this.children[i].render(_col);
      rot_total -= rot;
      ctx.restore();
      sway+=swaySpeed;		if(delay>0) delay--;		else growth+=(1-growth) * 0.1;
    }
    generation--;
  }

  function Leaf(size) {
    generation++;	var growth = 0,	delay = generation*11;
    this.render = function(col) {
      ctx.save();		ctx.fillStyle = col;	ctx.beginPath();	ctx.moveTo(0, 0);
      let dim = size*growth;
      //cx, cy,  ex, ey
      ctx.quadraticCurveTo(dim*2/5, -dim/6, 0, -dim*2/3);		ctx.quadraticCurveTo(-dim*2/5, -dim/6, 0, 0);
      ctx.fill();		ctx.restore();
      if(delay>0) delay--;		else growth+=(1-growth) * 0.1;
    }
    generation--;
  }

  function random(min, max) { return Math.random()*(max-min) +min; }

  function sliderUpdate(e) {
    size_m *= (e.value*Math.pow(0.75,e.value))/(window[e.id]*Math.pow(0.75,window[e.id]));
    window[e.id] = e.value;
    forest = [];
    for (var i=0; i<trees; i++) forest.push(new Branch(size_o*Math.pow(0.85,trees),0));
  }


})
