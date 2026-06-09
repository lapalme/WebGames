#!/bin/zsh
#  all games comment line for skipping its test
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

for game in $games ; do
    echo "***" ${game}/${game}_batch.js
    # node ${game}/${game}_batch.js | tail -1 # display only last line of output
    node ${game}/${game}_batch.js | grep "time:" # display only times
done
