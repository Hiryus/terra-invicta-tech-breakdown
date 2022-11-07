This is an attempt to navigate [Terra Invicta](https://store.steampowered.com/app/1176470/Terra_Invicta/) technology tree.

## Description

In the game, the tree is very complex and sluggish.
It doesn't give much info. on what each technology/project unlocks.

This app presents the technologies and projects in another way:
* Technologies and projects are displayed together.
* They are grouped under a "role" derived from the AI game data.
* Technologies are sorted logically by the researched points required to unlock them.
* Opening the technology details shows what the technology actually does (still working on this point) and what are all the prerequisites (in research order).

## Usage

The app available at https://hiryus.github.io/terra-invicta-tech-breakdown/app/ .
Just open the link in your favorite (recent) browser.

## Development

Browsers blocks access to local files for security reasons.
It is thus required to spin a little web server when developing locally.

The local server requires nodejs and npm installed.
```
# Install the dependencies (this is required only the first time):
npm ci

# start the server:
npm start
```
Then open your browser on http://localhost:3000
