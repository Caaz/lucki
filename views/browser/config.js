module.exports = {
  TRACK_FORMAT:
      '<tr data-selectable=true data-library-key="%(key)s">' +
        '<td>%(track.title)s</td>' +
        '<td>%(track.artist)s</td>' +
        '<td>%(track.album)s</td>' +
      '</tr>',
  NOW_PLAYING_FORMAT:
      '<span>%1$s</span>' +                   // Title
      '<span class="small">%2$s - %3s</span>' // Artist - Album
}
