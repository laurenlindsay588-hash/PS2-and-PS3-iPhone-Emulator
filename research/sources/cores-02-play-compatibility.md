Source: https://github.com/jpd002/Play-Compatibility
Title: GitHub - jpd002/Play-Compatibility: Play! - Compatibility Tracker · GitHub
Fetched: 2026-10-05T03:10:58.443Z

[Skip to content](https://github.com/jpd002/Play-Compatibility#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/jpd002/Play-Compatibility) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/jpd002/Play-Compatibility) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/jpd002/Play-Compatibility) to refresh your session.Dismiss alert

{{ message }}

[jpd002](https://github.com/jpd002)/ **[Play-Compatibility](https://github.com/jpd002/Play-Compatibility)** Public

- [Notifications](https://github.com/login?return_to=%2Fjpd002%2FPlay-Compatibility) You must be signed in to change notification settings
- [Fork\\
29](https://github.com/login?return_to=%2Fjpd002%2FPlay-Compatibility)
- [Star\\
221](https://github.com/login?return_to=%2Fjpd002%2FPlay-Compatibility)


master

[**4** Branches](https://github.com/jpd002/Play-Compatibility/branches) [**0** Tags](https://github.com/jpd002/Play-Compatibility/tags)

[Go to Branches page](https://github.com/jpd002/Play-Compatibility/branches)[Go to Tags page](https://github.com/jpd002/Play-Compatibility/tags)

Go to file

Code

Open more actions menu

## Latest commit

[![jpd002](https://avatars.githubusercontent.com/u/6760433?v=4&size=40)](https://github.com/jpd002)[jpd002](https://github.com/jpd002/Play-Compatibility/commits?author=jpd002)

[Update generate-report.yaml](https://github.com/jpd002/Play-Compatibility/commit/1c4fa50eaddc18dff43990ce8d561bfec6c15105)

Open commit details

4 months agoJun 9, 2026

[1c4fa50](https://github.com/jpd002/Play-Compatibility/commit/1c4fa50eaddc18dff43990ce8d561bfec6c15105) · 4 months agoJun 9, 2026

## History

[32 Commits](https://github.com/jpd002/Play-Compatibility/commits/master/)

Open commit details

[View commit history for this file.](https://github.com/jpd002/Play-Compatibility/commits/master/) 32 Commits

## Folders and files

| Name | Name | Last commit message | Last commit date |
| --- | --- | --- | --- |
| [.github](https://github.com/jpd002/Play-Compatibility/tree/master/.github ".github") | [.github](https://github.com/jpd002/Play-Compatibility/tree/master/.github ".github") | [Update generate-report.yaml](https://github.com/jpd002/Play-Compatibility/commit/1c4fa50eaddc18dff43990ce8d561bfec6c15105 "Update generate-report.yaml  Update .NET version") | 4 months agoJun 9, 2026 |
| [README.md](https://github.com/jpd002/Play-Compatibility/blob/master/README.md "README.md") | [README.md](https://github.com/jpd002/Play-Compatibility/blob/master/README.md "README.md") | [Update README.md](https://github.com/jpd002/Play-Compatibility/commit/2c7d874847f06a1a76b333264702511f169d215a "Update README.md") | 5 years agoJan 24, 2022 |
| [hash\_location.png](https://github.com/jpd002/Play-Compatibility/blob/master/hash_location.png "hash_location.png") | [hash\_location.png](https://github.com/jpd002/Play-Compatibility/blob/master/hash_location.png "hash_location.png") | [Update hash location image.](https://github.com/jpd002/Play-Compatibility/commit/4078e6e796eed625f1aeafba1d0a97526a0ac696 "Update hash location image.") | 7 years agoMar 28, 2019 |
| View all files |

## Repository files navigation

# Play! - Compatibility Tracker

[Permalink: Play! - Compatibility Tracker](https://github.com/jpd002/Play-Compatibility#play---compatibility-tracker)

This is the official [Play!](https://github.com/jpd002/Play-) compatibility tracker. Based on the same concept for cxbx: [https://github.com/Cxbx-Reloaded/game-compatibility](https://github.com/Cxbx-Reloaded/game-compatibility).

# Discord

[Permalink: Discord](https://github.com/jpd002/Play-Compatibility#discord)

You can join the official Discord with this link [https://discord.gg/HygQnQP](https://discord.gg/HygQnQP). When in doubt about any information you want to report, that's the best place to ask and for general discussion about the project in general.

# Guidelines

[Permalink: Guidelines](https://github.com/jpd002/Play-Compatibility#guidelines)

The games can be tested on either platform, but you can add the info about the platform it was tested on in the report. The compatibility should be more or less the same for every supported platform. If there's conflicting reports about a game's status on different platforms it probably means there's a platform specific bug that should be addressed differently than a compatibility issue. In that case, please open an issue on the main repository.

The commit hash of the build you're using can be found in the About dialog.

[![hash_location](https://github.com/jpd002/Play-Compatibility/raw/master/hash_location.png)](https://github.com/jpd002/Play-Compatibility/blob/master/hash_location.png)

The games can be tested on the build you've made yourself. Just specify the commit hash of your build in the report.

# Game statuses

[Permalink: Game statuses](https://github.com/jpd002/Play-Compatibility#game-statuses)

IMPORTANT NOTE 1: please, be sure that the information you are reporting is 100% verified against the status descriptions below. This information it's what other users rely on to understand which games work and how well they work.

IMPORTANT NOTE 2: when in doubt, just open any valid issue that already has a label added with the status (invalid or not verified issues aren't given any status label) and follow the example. Example of valid issue: [#1212](https://github.com/jpd002/Play-Compatibility/issues/1212)

**state-playable** means that the game is fully playable. It's important to notice that you _can't use_ external save files to progress beyond some parts where the emulator itself would have a gamebreaking issue (if you need a save to bypass an issue, the game isn't playable). For games where saving/loading is mandatory to keep your progress in some meaningful way, not being able to save also makes the game _not playable_.

**state-ingame** means somewhat playable past title screens (including with graphics bugs, crashes, saving, loading and other major problems).

**state-intro** means nothing but an intro/opening of the game is shown (such as a video/animation/company name/etc.).

**state-loadable** means that the game is capable of being read but can't actually start/run yet. If the game is at least _trying to run some frames_ (framerate is anything other than zero), should be reported as _loadable_ and not _nothing_.

**state-nothing** means that the game won't even be read by the emulator and/or crashes the emulator before the game even gets to show much of anything.

## About

Play! - Compatibility Tracker

### Resources

[Readme](https://github.com/jpd002/Play-Compatibility#readme-ov-file)

[Activity](https://github.com/jpd002/Play-Compatibility/activity)

### Stars

**221** stars

### Watchers

**32** watching

### Forks

[**29** forks](https://github.com/jpd002/Play-Compatibility/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fjpd002%2FPlay-Compatibility&report=jpd002+%28user%29)

## Releases

## Packages

## Used by

## Contributors

You can’t perform that action at this time.