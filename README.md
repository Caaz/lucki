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

## To-do
- Delete file of track currently playing (or right-clicked in context menu)
  - *(obscure)* Keyboard shortcut to also do this quickly
- Show file of track in relevant file explorer
- Drag and drop library additions
  - Multi-directory libraries
- *Display album art next to songs in chart?*
- flac, m4a, wav, midi, ogg,  etc support
- In-player metatag editor
- Remote local network control
- *Option to force window to show all metatag columns?*
- Remove leading zeros from track #
- Previous/Next track also function as rewind and fastforward
- Repeat One toggle
- Impliment actual shuffle mode
- *Stop button?*
- Time remaining/time passed/total time of song
- Length of song column in chart
- Size of song file column
- Configure what columns to include in chart
- Playlists
- Autogenerate *Recently Added* and *Most Frequently Played* playlists
- *Equalizer?* → *Autoequilizer?*
- Make compatible with *"Open With"* option in context menu of audio files (i.e. clicking an audio file will open Lucki and play it)
- Slightly thicker line separators between artists when sorting by artist
  - Slightly thicker line separators between starting letters when sorting by anything else (e.g. thicker line between last song starting with "a" and first song starting with "b")
- **Autosave user window/table dimension adjustments!**
- Impliment Search
- Theming (aka the selling point of this project)
  - *Extraneous, but perhaps restyle logo icon to match user's theme settings? Probably challenging, but not impossible.*


### Misc
We couldn't have made this possible without those who created Electron, NodeJS, and those who handle ID3 libraries so credit to those creators as well.
