module.exports = {
  TRACK_FORMAT:
      '<tr data-selectable=true data-library-key="%(key)s">' +
        '<td>%(track.title)s</td>' +
        '<td>%(track.artist)s</td>' +
        '<td>%(track.album)s</td>' +
      '</tr>',
  NOW_PLAYING_FORMAT:
      '<span>%(track.title)s</span>' +                   // Title
      '<span class="small">%(track.artist)s - %(track.album)s</span>' // Artist - Album
}
