#!/bin/zsh
#  all games (comment line for skipping their tests)
games=(\
       AntiVirus \
       AsteroidEscape \
       CannibalMonsters \
       CatsNBoxes \
       CityMaze \
       FlipIt \
       GraveYardShift \
       GrizzlyGears \
       HotSpot \
       JumpIn \
       LaserMaze \
       RiverCrossing \
       RushHour \
       SnowProblem \
       SquirrelsGoNuts \
       TempleTrap \
       Tilt \
       TipOver \
       Titanic \
       )

## open all games in default browser on macOS with Safari 
## for which the same origin checking has been disabled...
## This should not be used in production, but is useful for checking "obvious" errors
for game in $games ; do
    open ${game}/${game}.html
done
