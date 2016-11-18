# Lucki Media Player

> A music player by developers for developers. Hackable, Stackable, Droppable, Poppable.

Lucki Media Player is a simple media player. It makes no attempts to be the best, only the most flexible.

![screenshot](https://dl.dropboxusercontent.com/u/9305622/KEEP/Dev/lucki.png "Screenshot")

## Todo list
- Library Management
  - [ ] Update Library Scraper to include more than just .mp3
  - [ ] Watch library folder for changes
  - Library Cache store more information on files
    - [ ] Last file change timestamp
    - [x] Location
    - [ ] Album Art
    - [ ] File Size
    - [x] ID3 Tags
    - [ ] Play Length
    - [ ] Visualizer Information
  - Tag Management
    - [ ] Download album art
    - [ ] Download tags
    - [ ] Download lyrics
- Playlist Management
  - [ ] Create new playlists
  - [ ] Drag and drop?
- Add configuration options
  - [ ] Custom Themes
  - [ ] Custom Library location
- External API Service
  - Media Controls
    - [ ] Play
    - [ ] Pause
    - [ ] PlayToggle
    - [ ] Next
    - [ ] ToggleShuffle
    - [ ] ToggleRepeat
  - Utilities
    - [ ] Search
- Misc
  - [ ] Sortable table
  - [ ] Display playhead
  - [ ] Ability to move playhead
  - [ ] Display volume range
  - [ ] Cache Compiled less
  - [ ] Cache Compiled pug

## Development
If you're planning on helping development, make sure you're on the development branch! I try to make the master branch official stable releases. Stable being used lightly.
### Install
`npm install`

### Run
`npm start`

### Build
`npm run build`

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Daniel Caaz](https://caaz.me)
