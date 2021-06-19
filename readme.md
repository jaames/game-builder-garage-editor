Experimental savedata editor for Nintendo's [Game Builder Garage](https://www.nintendo.co.uk/Games/Nintendo-Switch-download-software/Game-Builder-Garage-1964648.html).

This is super early, but I've already made a lot of progress and expect to be able to pull off some pretty neat stuff -- like texture edits, 3D level export, and so on.

Written in Typescript since I would like to create web-based tools around the game.

Current status:
 - Parses user-generated level files extracted from the game's savedata
 - Exports edited level files (!!!)
 - Reads game metadata (title, author, ids, etc)
 - Reads+displays game thumbnail image
 - Reads+displays game textures
 - Reads Nodon list (different Nodon types + their parameters aren't currently supported)
 - Reads Nodon connections

Please don't submit PRs or issues yet, this code is going to change a lot as the project develops. If you're interested in helping reverse-engineer Game Builder Garage, you can find me on Twitter `@rakujira`, or on Discord `@jaames#9860` -- I will likely post on Twitter when I feel like I've made enough progress for an announcement.