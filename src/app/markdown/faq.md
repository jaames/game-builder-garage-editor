# FAQs

### What is this?

This is a savedata editor for Game Builder Garage, a fun game-creation game created by Nintendo for the Nintendo Switch. It can be used to edit user-created games on a desktop PC.

### What can be edited?

Currently only textures can be edited, with a more advanced texture editor toolset than the one the app provides (select tool and image import, anybody?). Most of the file format is figured out, so in the future it should also be possible to edit the Nodon graph, world object placement, etc... given enough time for research and development!

Right now, the downside is that edited games can't be shared online since the game will tell you the data is corrupted ([I'm working on it, but could use a hand](https://github.com/jaames/game-builder-garage-editor/issues/2)) -- but it will otherwise be able to load + edit the game locally just fine.

### How do I use it?

You'll need a hacked Nintendo Switch running the [Atmosphère](https://github.com/Atmosphere-NX/Atmosphere) custom firmware to be able to dump and restore savedata. If you haven't hacked your Switch yet, you can follow [this guide](https://nh-server.github.io/switch-guide/) -- but note that you can still play online if you ignore the 90dns / `emummc.txt` step, so long as you aren't pirating anything or using cheats in online play (which are both *very good ways of getting your Switch banned*).

I personally use [EdiZon](https://github.com/WerWolv/EdiZon) to dump/restore saves, and [ftpd classic](https://github.com/mtheall/ftpd) to transfer content between my Switch and PC. My process looks something like this:

1. Create a game in Game Builder Garage.
2. Close Game Builder Garage, open another game while holding R to trigger the Homebrew Menu.
3. Launch EdiZon.
4. Find Game Builder Garage in the Edizon menu, press A to accept.
5. Select your user profile
6. Press X to do a backup, give the backup file a recognizable name, select "No" when Edizon asks if you'd like to upload to anonfile.com.
7. Press B twice to return to the Homebrew Menu.
8. Launch ftpd classic.
9. Connect to the FTP server using a desktop FTP client.
10. In the FTP client, navigate to `switch/EdiZon/saves/0100FA5010788000`, you should see a folder there with the same name as the save backup you just created.
11. Copy the contents to your PC, then drag+drop them into this tool.
12. Edit the contents, save (TODO).
13. Use the FTP client to copy the edited files back to the folder in `switch/EdiZon/saves/0100FA5010788000`.
14. Press the plus button on your Switch to quit ftpd classic.
15. Launch EdiZon and select Game Builder Garage again, press A and select the same user profile as before.
16. Press Y to restore a backup. Select the folder where you placed your edited files.
17. Press A to accept, and select "Yes" when you are asked if you want to inject the backup.
18. Congrats! You can now quit the Homebrew Menu with your Switch's home button and view your edited game in Game Builder Garage!

### How can I help?

There's still a lot to reverse-engineer! My next goal is figuring out [`mValueHashCache`](https://github.com/jaames/game-builder-garage-editor/issues/2) so that edited games can be uploaded to the online sharing service. After that I'd like to start mapping out all the different Nodon types and how all their settings are stored, which would be quite an undertaking. If you're interested in helping out, you can find me on Twitter [(`@rakujira`)](https://twitter.com/rakujira), or on Discord (`@jaames#9860`).

### Credits

This save editor is built by [James Daniel](https://github.com/jaames), with thanks to [Zeldamods](https://zeldamods.org/) for their [Nintendo BYML documentation](https://zeldamods.org/wiki/BYML) and [byml-v2 tool](https://github.com/zeldamods/byml-v2), and [Yannik](https://github.com/kinnay) for help with figuring out some BYML intricacies.

### Disclaimer

Please note that Game Builder Garage is © Nintendo Co., Ltd., and this project is not affiliated with or endorsed by Nintendo in any way. Editing saves in unsafe ways *may* cause your savedata to become corrupted.