# synacor-challenge

Solving the [Synacor Challenge](https://challenge.synacor.com/) with NodeJS.

To Run the Game
---
```
npm start
```

Extra Game Commands
---
```
autoplay - plays the entire game start to finish
hack coins - solves the coin problem
hack teleporter - solves the teleporter problem
hack orb - solves the orb problem
save - saves stack, register, memory
load - loads stack, register, memory
exit - exit the game
```

Extra non-game features
---
```
# run a custom bin
node vm <bin>

# disassemble a bin
node disassemble <bin>

# create your own bin, see examples in ./asm and ./bin
node assemble <input> <output>
```
