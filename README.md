# Lucki Media Player

> A music player by developers for developers. Hackable, Stackable, Droppable, Poppable.

Lucki Media Player is a simple media player. It makes no attempts to be the best, only the most flexible.

![screenshot](https://dl.dropboxusercontent.com/u/9305622/KEEP/Dev/lucki.png "Screenshot")

## Feature List and to-do
- UI Improvements
  - [x] Keyboard controls
- Library Management
  - [ ] Watch library folder for changes
  - Tag Management
    - [ ] Download album art
    - [ ] Download tags
    - [ ] Download lyrics
- Playlist Management
  - [ ] Create new playlists
  - [ ] Drag and drop
- Add configuration options
  - [ ] Custom Themes
  - [ ] Custom Library location
- Use libgroove
  - [ ] Update Library Scraper to include more than just .mp3
  - Library Cache store more information on files
    - [ ] Last file change timestamp
    - [ ] Location
    - [ ] File Size
    - [ ] ID3 Tags
    - [ ] Play Length
    - [ ] Visualizer Information
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
  [ ] Cache Compiled less
  [ ] Cache Compiled pug

## Development

### Install

`npm install`

### Run

`npm start`

### Build

`npm run build`

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Daniel Caaz](https://caaz.me)
