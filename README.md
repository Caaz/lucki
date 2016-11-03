# Lucki Media Player

> A music player by developers for developers. Hackable, Stackable, Droppable, Poppable.

Lucki Media Player is a simple media player. It makes no attempts to be the best, only the most flexible.

![screenshot](https://dl.dropboxusercontent.com/u/9305622/KEEP/Dev/lucki.png "Screenshot")

## Todo
- [ ] Watch library folder for changes
- [ ] Keyboard controls
- [ ] API for now playing information and external controls.
- [ ] Shuffle
- [ ] Search Library
- [ ] Configuration window
- [ ] Use libgroove to play audio on the main process instead of the render process.
- [ ] Ability to add arbitrary tracks to the library
- [ ] Ability to create playlists
- [ ] Play music other than MP3
- [ ] Ability to adjust tags
- [ ] Organize Library
- [ ] Stop using CLI pug
- [ ] Stop using CLI sass
- [ ] Custom User defined SCSS stylesheets.
- [ ] Custom Plugins with JS
- [ ] Custom Layout with Pug
- [x] Cache Library
- [x] Play Music
- [x] List Music

## Development

### Install

`npm install`

You're also going to need pugjs and sass to compile the views and assets for electron.
I want to change that, but that's where we are right now.

### Run

`npm start`

### Build

`npm run build`

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Daniel Caaz](https://caaz.me)
