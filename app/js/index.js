const $ = require('jquery');
const {ipcRenderer} = require('electron')

let audio;
let $content;
let $status;
let $nowPlaying;
$(function(){
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
    console.log(target);
    if(target.playable) playIndex($(e.target.parentNode).index());
  });
  ipcRenderer.on('library', (event, library) => {
    let $newContent = $('<tbody>');
    for(let file in library) {
      track = library[file];
      let $row = $('<tr data-playable=true>'+
      '<td>'+track.title+'</td>'+
      '<td>'+track.artist+'</td>'+
      '<td>'+track.album+'</td>'+
      '</tr>');
      $row.data({info:track});
      $newContent.append($row);
    };
    $content.replaceWith($newContent);
    $content = $newContent;
  });
  ipcRenderer.on('status', (event, arg) => { $status.text(arg); });
  ipcRenderer.send('library', 'get');
});

function playIndex(index) {
  if(audio.dataset.index) { $content.children()[audio.dataset.index].className = '' }
  audio.dataset.index = index;
  let $target = $($content.children()[index]);
  $target.addClass('playing');
  let info = $target.data('info');
  audio.src = info.location;

  $nowPlaying.children().first().eraseText(function($self) {
    let $target = $($content.children()[index]);
    let info = $target.data('info');
    $self.typeText(info.title);
  }).next().eraseText(function($self) {
    let $target = $($content.children()[index]);
    let info = $target.data('info');
    $self.typeText(info.artist+' - '+info.album);
  })
  // $nowPlaying.html('<span>'+info.title+'</span><span>'+info.artist+' - '+info.album+'</span>');
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

// Typer
$.fn.typeText = function(text,callback) {
  if((typeof text) == 'string') { text = text.split(''); this.text(''); }
  this.text(this.text() + text.shift());
  if(text.length) setTimeout(function($self){ $self.typeText(text, callback); }, 10, this);
  else if(callback) callback(this);
  return this;
}
$.fn.eraseText = function(callback) {
  var hasMore = false;
  this.each(function(e,t){
    t.textContent = t.textContent.substr(0,t.textContent.length-1);
    if(t.textContent.length) hasMore = true;
  });
  if(hasMore) { setTimeout(function($self) { $self.eraseText(callback); }, 10, this); }
  else if(callback) callback(this);
  return this;
}
