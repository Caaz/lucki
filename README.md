# ![logo](assets/icon-small.png) Lucki Media Player

> A music player by developers for developers.

Lucki Media Player is a simple media player. It makes no attempts to be the best, only the most flexible.

![screenshot](https://dl.dropboxusercontent.com/u/9305622/KEEP/Dev/lucki.png "Screenshot")

## Development
If you're planning on developing Lucki, make sure you're on the development branch! I try to make the master branch official stable releases. "Stable" should be taken with a grain of salt.
Try to keep to the xo rules defined in the [package.json](package.json)

### Install
`npm install`

### Run
`npm start`

### Build
`npm run build`

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).

## License
MIT © [Daniel Caaz](https://caaz.me)

## Collaborators
- Daniel Caaz
- Gentry Rolofson  
- Michael Bartlett  

## Known bugs

  - Search is currently broken
  - Previous Track doesn't actually go to your previous track
  - Shuffle is actually random

## To-do

- *Library*
  - [ ] Watch library folder for changes
  - [ ] Add to library via drop-in
  - [ ] More than one library directory
  - [ ] flac, m4a, wav, midi, ogg support
- *Controls*
  - [ ] Previous/Next track also function as rewind and fast-forward
  - [ ] Repeat Playlist/One toggle
  - [ ] Shuffle/Random toggle
  - [ ] Stop control
- *Library browser*
  - [ ] Add a context menu
    - [ ] Show file properties
    - [ ] Ability to edit tags
    - [ ] Delete file
      - [ ] *(obscure)* Keyboard shortcut to also do this quickly
    - [ ] Show in file explorer
  - [ ] Toggle table columns
  - [ ] Remove leading zeros from track #
  - [ ] Track duration and current time in now playing
  - [ ] Track duration as a column
  - [ ] File size of track as a column
- *Playlist*
  - [ ] Dynamic playlists
    - [ ] Recently Added
    - [ ] Most played
    - [ ] Suggested from now playing
  - [ ] Custom playlists
    - [ ] Drag tracks into playlist
- *Desktop Integration*
  - [ ] Set Lucki as preferred default application to open media files
  - [ ] Show notifications properly on OSX, right now it has two icons
  - [ ] Show album art in notifications
- *Sort changes*
  - [ ] When sorting by artist, group by album.
    - [ ] Show album art in a column with this view
  - [ ] When sorting by artist, ignore 'The '
  - [ ] When sorting by album, group by artist.
  - [ ] Group everything else by letter
- *Misc*
  - [ ] Add an Equalizer
  - [ ] Save window dimensions
  - [ ] Ability to choose a different theme
    - [ ] Let themes have their own icon.
  - [ ] Local webserver for remote control

### Misc
We couldn't have made this possible without those who created Electron, NodeJS, and those who handle ID3 libraries so credit to those creators as well.
