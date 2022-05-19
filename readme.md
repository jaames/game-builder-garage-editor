Web-based, experimental savedata editor/viewer for Nintendo's [Game Builder Garage](https://www.nintendo.co.uk/Games/Nintendo-Switch-download-software/Game-Builder-Garage-1964648.html)

### Status 

**Currently on hold due to lack of interest and an [issue regarding file hashes](https://github.com/jaames/game-builder-garage-editor/issues/2) that prevents games from being uploaded online.**

Implemented:
 - Full level file parser, reads metadata, textures, nodon, connections, etc
 - Partial level file exporter
 - Texture editor
 - Nodon graph viewer (pretty basic, doesn't support ports or settings yet)
 - 3d world viewer (also basic, doesn't map textures properly, doesn't support connectors or customised world lighting)

### Screenshots

Game information view, also showing all the textures used:

![](https://github.com/jaames/game-builder-garage-editor/blob/main/img/gameview.png?raw=true)

Texture editor with various tools:

![](https://github.com/jaames/game-builder-garage-editor/blob/main/img/textureedit.png)

Basic Nodon graph view --  connection ports and settings aren't currently mapped, so not too useful:

![](https://github.com/jaames/game-builder-garage-editor/blob/main/img/graphview.png)

3D world viewer, textures currently aren't quite mapped correctly in all directions:

![](https://github.com/jaames/game-builder-garage-editor/blob/main/img/3dview.png)

glTF exporter so levels can be brought into other 3D software:

![](https://github.com/jaames/game-builder-garage-editor/blob/main/img/blender.png)

### CLI

You can run parts of this tool from the command line to inspect files etc

#### Clone GitHub Repo

```bash
git clone https://github.com/jaames/game-builder-garage-editor
```

Then enter into it

```
cd game-builder-garage-editor
```

#### NPM dependencies

Make sure you have installed [NodeJS](https://nodejs.org/en/), which also installs NPM.

Then install the project dependencies by running this inside the `game-builder-garage-editor` directory:

```
npm install
```

#### CLI usage

Use `npm run cli` to run the command line interface

```
Usage: npm run cli [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  game-hash <input>            attempt to generate a value hash for a given game BYML file (not working)
  game-dump <input> <output>   dump game BYML content to a YAML file
  game-meta <input>            returns metadata for a given game BYML file
  table-hashes <input>         read value hashes from a LgcTpb.bin BYML file
  table-dump <input> <output>  dump table BYML content to a YAML file
  help [command]               display help for command
```

----

Please don't submit PRs or issues yet, this code is going to change a lot as the project develops. If you're interested in helping reverse-engineer Game Builder Garage, you can find me on Twitter `@rakujira`, or on Discord `@jaames#9860` -- I will likely post on Twitter when I feel like I've made enough progress for an announcement.
