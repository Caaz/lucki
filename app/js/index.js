const $ = require('jquery');
const {ipcRenderer} = require('electron')

let audio;
let $content;
let $status;
$(function(){
  console.log("We in this");
  audio = $('audio')[0];
  audio.onended = next;
  $content = $('#content tbody');
  $status = $('#status');
  $('#controls').click(function(e){
    if(e.target.id == 'toggle-play') togglePlay();
    else if(e.target.id == 'next-track') next();
    else if(e.target.id == 'previous-track') previous();
  });
  $('#content').click(function(e) {
    let target = e.target.parentNode.dataset;
    if(target.playSrc) playIndex($(e.target.parentNode).index());
  });

  ipcRenderer.on('add', (event, arg) => {
    $content.append(
      '<tr data-play-src="'+encodeURI(arg.location)+'">'+
        '<td>'+arg.title+'</td>'+
        '<td>'+arg.artist+'</td>'+
        '<td>'+arg.album+'</td>'+
      '</tr>');
    // console.log("Got "+arg);
  })
  ipcRenderer.on('status', (event, arg) => { $status.text(arg); })
  ipcRenderer.send('library', 'get')
});

function playIndex(index) {
  console.log("Playing index "+index);
  if(audio.dataset.index) { $content.children()[audio.dataset.index].className = '' }
  audio.dataset.index = index;
  $content.children()[index].className = 'playing';
  audio.src = $content.children()[index].dataset.playSrc;
  play();
}
function play() { audio.play(); updateInfo(); }
function pause() { audio.pause(); updateInfo(); }
function togglePlay() { if(audio.paused) play(); else pause() }
function next() { playIndex((audio.dataset.index)?(parseInt(audio.dataset.index)+1):0); }
function previous() { playIndex((audio.dataset.index)?(parseInt(audio.dataset.index)-1):0); }
function updateInfo() {
  let isPaused = audio.paused
  $('#toggle-play').toggleClass('fa-play',isPaused).toggleClass('fa-pause',!isPaused)
}
