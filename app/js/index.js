const $ = require('jquery');
const {ipcRenderer} = require('electron')

let audio;
let $content;
let $status;
let $nowPlaying;
$(function(){
  console.log("We in this");
  audio = $('audio')[0];
  audio.onended = next;
  $content = $('#content tbody');
  $status = $('#status');
  $nowPlaying = $('#now-playing');
  $('#controls').click(function(e){
    if(e.target.id == 'toggle-play') togglePlay();
    else if(e.target.id == 'next-track') next();
    else if(e.target.id == 'previous-track') previous();
  });
  $('#content').click(function(e) {
    let target = e.target.parentNode.dataset;
    console.log('click at');
    console.log(target);
    if(target.playable) playIndex($(e.target.parentNode).index());
  });

  ipcRenderer.on('add', (event, arg) => {
    let $row = $('<tr data-playable=true>'+
      '<td>'+arg.title+'</td>'+
      '<td>'+arg.artist+'</td>'+
      '<td>'+arg.album+'</td>'+
    '</tr>');
    $row.data({info:arg});
    $content.append($row);
    // console.log("Got "+arg);
  })
  ipcRenderer.on('status', (event, arg) => { $status.text(arg); })
  ipcRenderer.send('library', 'get')
});

function playIndex(index) {
  console.log("Playing index "+index);
  if(audio.dataset.index) { $content.children()[audio.dataset.index].className = '' }
  audio.dataset.index = index;
  let $target = $($content.children()[index]);
  $target.addClass('playing');
  let info = $target.data('info');
  audio.src = info.location;
  $nowPlaying.html('<span>'+info.title+'</span><span>'+info.artist+' - '+info.album+'</span>');
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
