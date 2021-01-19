## user-settings-dir

user-settings-dir is a small library to find the directory to persist application settings for a user. Many node-ish applications store settings properly on *nixy OSes using a dotfile (or dotdirectory) in the user's home folder. On Windows however, they tend to store files incorrectly, in the user's home directory, rather than in appdata. The officially sanctioned place in windows is in %APPDATA%,

On Vista and newer, by default they evaluate like this:
  - `%USERPROFILE%` (wrong): `C:\Users\{UserName}\`
  - `%APPDATA%` (right): `C:\Users\{UserName}\AppData\Roaming`

On XP:
  - `%USERPROFILE%` (wrong): `C:\Documents and Settings\{UserName}\`
  - `%APPDATA%` (right): `C:\Documents and Settings\{UserName}\Application Data\`

In addition to being formally correct (and necessary if you ever want to get something Microsoft certified), this is just cleaner. I'm a neat-freak, and I like to keep my directories clean. Much as you hide settings in dotfiles in *nixy systems, those settings are meant to be hidden in AppData on windows systems. I'm hoping that making this module available might help prod at least a few people in the right direction, when making cross platform node applications.

### notes
This module was based off of https://github.com/sindresorhus/user-home so thank him, really.
