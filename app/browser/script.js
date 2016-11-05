const $ = require('jquery')
const {ipcRenderer} = require('electron')

// Audio object for playing
let audio;
// $allTracks for searching
let $allTracks;
// library for holding information on tracks.
let library;
// hold previously played music.
let played = [];
// Status bar
let $status;
// Now playing information.
let $nowPlaying;
// IF searchable!
let searchable = true;
$(function(){

  audio = $('audio')[0];
  console.log(audio);
  audio.onended = next;
  $status = $('#status');
  $nowPlaying = $('#now-playing');
  $('#search .button').click(search);
  $('#controls').click(function(e){
    if(e.target.id == 'toggle-play') playToggle();
    else if(e.target.id == 'next-track') next();
    else if(e.target.id == 'previous-track') previous();
  })
  let $content = $('#content');
  var ar=new Array(37,38,39,40);

  $(document).keydown(function(e) {
    if((e.which <= 40) && (e.which >= 37) || (e.key === ' ')) {
      e.preventDefault();
      return false;
    }
    return true;
  });
  $(document).keydown(function(e){
    if(e.target.tagName === 'BODY') {
      // console.log(e.key);
      switch(e.key){
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          previous();
          break;
        case "ArrowUp":
          select($('tr.selected').prev());
          break;
        case "ArrowDown":
          select($('tr.selected').next());
          break;
        case "Enter":
          playIndex($('tr.selected').index());
          break;
        case " ":
          playToggle();
          break;
      }
    }
    else if(e.target.tagName === 'INPUT') {
      // Search
      if(searchable) { searchable = false; window.setTimeout(search,1000); }
    }
  });
  $content.dblclick(function(e) {
    let target = e.target.parentNode.dataset
    console.log(target)
    if(target.playable) playIndex($(e.target.parentNode).index())
  })
  $content.click(function(e) {
    let target = e.target.parentNode
    if(target.dataset.playable) select($(target))
  })
  ipcRenderer.on('library', (event, lib) => {
    let $newContent = $('<tbody>')
    library = lib
    for(let file in library) {
      track = library[file]
      $newContent.append('<tr data-playable=true data-library-key="'+file+'">'+
      '<td>'+track.title+'</td>'+
      '<td>'+track.artist+'</td>'+
      '<td>'+track.album+'</td>'+
      '</tr>');
    }
    $('#content tbody').replaceWith($newContent)
    $allTracks = $newContent.clone();
  })
  ipcRenderer.on('status', (event, arg) => { $status.text(arg); })
  ipcRenderer.send('library', 'get')
})
function playKey(key,skipPush) {
  let track = library[key];
  audio.src = encodeURI(track.location).replace(/\?/g, '%3F');
  $nowPlaying.children().first().eraseText(function($self) { $self.typeText(track.title) })
  .next().eraseText(function($self) { $self.typeText(track.artist+' - '+track.album) });
  $('#content tbody').find('.playing').removeClass('playing');
  $('#content tr[data-library-key="'+key+'"]').addClass('playing')
  play();
  if(!skipPush) {
    played.push(key);
    $('#previous-track').removeClass('disabled');
  }
}
function playIndex(index) {
  audio.dataset.index = index
  playKey($('#content tbody').children()[index].dataset.libraryKey);
}
function select($item) {
  if($item.length == 0) return
  $('tr.selected').removeClass('selected');
  $item.addClass('selected');
  let $content = $('#content');
  let topAdjust = $item.offset().top-$content.offset().top;
  let bottomAdjust = topAdjust+$item.height()-$content.height()
  if(topAdjust < 0) $content[0].scrollTop+=topAdjust
  else if(bottomAdjust > 0) $content[0].scrollTop+=bottomAdjust
}
function search() {
  let query = $('#search input').val().toLowerCase();
  var output = [];
  $allTracks.children().each(function(i, e) {
    if(e.innerText.toLowerCase().indexOf(query) != -1) { output.push($(e).clone()); }
  });
  $("#content tbody").empty().append(output);
  searchable = true;
}
function playToggle() { if(audio.paused) play(); else pause() }
function play() { audio.play(); updateInfo(); }
function pause() { audio.pause(); updateInfo(); }
function next() {
  if($('#repeat')[0].checked) { play() }
  else if($('#shuffle')[0].checked) { playIndex(Math.floor(Math.random()* $('#content tbody tr').length)) }
  else { playIndex((audio.dataset.index)?(parseInt(audio.dataset.index)+1):0); }
}
function previous() {
  if(played.length == 0) return
  playKey(played.pop(),true);
  if(played.length == 0) $('#previous-track').addClass('disabled');
}
function updateInfo() {
  let isPaused = audio.paused
  $('#toggle-play').toggleClass('fa-play',isPaused).toggleClass('fa-pause',!isPaused)
}


// Typer
$.fn.typeText = function(text,callback) {
  if((typeof text) == 'string') { text = text.split(''); this.text(''); }
  this.text(this.text() + text.shift())
  if(text.length) setTimeout(function($self){ $self.typeText(text, callback); }, 10, this)
  else if(callback) callback(this)
  return this
}
$.fn.eraseText = function(callback) {
  var hasMore = false
  this.each(function(e,t){
    t.textContent = t.textContent.substr(0,t.textContent.length-1)
    if(t.textContent.length) hasMore = true
  })
  if(hasMore) { setTimeout(function($self) { $self.eraseText(callback); }, 10, this); }
  else if(callback) callback(this)
  return this
}
