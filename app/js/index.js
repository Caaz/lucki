const $ = require('jquery')
const {ipcRenderer} = require('electron')

let audio;

let $allTracks;

let library;

let $status;
let $nowPlaying;
$(function(){
  audio = $('audio')[0]
  audio.onended = next
  $status = $('#status')
  $nowPlaying = $('#now-playing')
  $('#search input').keyup(search);
  $('#search .button').click(search);
  $('#controls').click(function(e){
    if(e.target.id == 'toggle-play') togglePlay()
    else if(e.target.id == 'next-track') next()
    else if(e.target.id == 'previous-track') previous()
  })
  $('#content').dblclick(function(e) {
    let target = e.target.parentNode.dataset
    console.log(target)
    if(target.playable) playIndex($(e.target.parentNode).index())
  })
  $('#content').click(function(e) {
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

function playIndex(index) {
  let $tracks = $('#content tbody');
  if(audio.dataset.index) { $tracks.children()[audio.dataset.index].className = '' }
  audio.dataset.index = index
  let $target = $($tracks.children()[index])
  $target.addClass('playing')
  let info = library[$target[0].dataset.libraryKey];
  audio.src = info.location

  $nowPlaying.children().first().eraseText(function($self) {
    $self.typeText(info.title)
  }).next().eraseText(function($self) {
    $self.typeText(info.artist+' - '+info.album)
  })
  // $nowPlaying.html('<span>'+info.title+'</span><span>'+info.artist+' - '+info.album+'</span>')
  play()
}
function select($item) {
  $('tr.selected').removeClass('selected')
  $item.addClass('selected')
}
function search() {
  let query = $('#search input').val();
  console.log("Searching for "+query);
  console.log($allTracks.length);
  var output = [];
  $allTracks.children().each(function(i, e) { if(e.innerText.match((new RegExp(query, "i")))) { output.push($(e).clone()); } });
  $("#content tbody").empty().append(output);
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
