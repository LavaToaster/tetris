# Tetris Clone

So I watched a [video](https://www.youtube.com/watch?v=QOJfyp0KMmM), and felt the need to go build something. This isn't done, it isn't for use for anyone but me, and I'm having fun :D


### Running

I'm using the parceljs for developing this so install it

```bash
npm install -g parcel-bundler
```

Then bring it up for development:

```
parcel index.html
```

### TODO

- [x] Spawn Pieces
- [x] Move Pieces
- [ ] Rotate Pieces
  - [ ] Wall Kick Rotation
- [x] Spawn piece one it reaches the "bottom"
- [ ] Reset game once a piece spawns and collides with another one
- [ ] Hold piece
- [ ] Replay system
    - Once I've worked out what the hell I'm doing it should be fairly trivial
      to convert what I have into an event sourced system, where I can store
      the commands, and time travel in state. (redux should be a good solution for this)
