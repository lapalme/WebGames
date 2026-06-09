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

## open all games in default browser on macOS
for game in $games ; do
    open ${game}/${game}.html
done
