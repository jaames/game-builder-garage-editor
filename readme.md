Experimental game data parser for Nintendo's [Game Builder Garage](https://www.nintendo.co.uk/Games/Nintendo-Switch-download-software/Game-Builder-Garage-1964648.html).

This is super super early (the game has barely been out for 24 hours here!), but I've already made a lot of progress and expect to be able to pull off some pretty cool stuff, like texture edits, 3D level export, etc.

Written in Typescript only since I would like to create web-based tools around the game.

Current status:
 - Parses user-generated level files extracted from the game's savedata
 - Reads game metadata (title, author, ids, etc)
 - Reads+displays game thumbnail image
 - Reads+displays game textures
 - Reads game object list
 - Reads node connection list

Please don't submit PRs or issues yet, this code is going to change a lot as the project develops. If you're interested in helping reverse-engineer Game Builder Garage, you can find me on Twitter `@rakujira`, or on Discord `@jaames#9860`