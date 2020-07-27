import p5 from 'p5';
import { EntityDefinition } from './entityDefinitions';
import { Block } from './block';
import { BLOCK_SIZE } from '../consts';
import type { Engine } from '../engine';
import { randomInt } from '../util';

export enum EntityMove {
  Left,
  Right,
  Down,
  Up,
}

export enum EntityMoveResult {
  Ok,
  Invalid,
  ReachedBottom,
}

export class Entity {
  public blocks: Block[];
  public w = 0;
  public h = 0;
  public id: number;

  constructor(
    private engine: Engine,
    private entityDefinition: EntityDefinition,
    public position: p5.Vector,
  ) {
    this.id = randomInt(0, 100);

    this.blocks = entityDefinition.vectors.map((vector) => {
      if (vector.x > this.w) {
        this.w = vector.x;
      }

      if (vector.y > this.h) {
        this.h = vector.y;
      }

      return new Block(engine.gameLayerSketch, vector, entityDefinition.color);
    });

    this.w++;
    this.h++;
  }

  public draw() {
    const p = this.engine.gameLayerSketch;

    p.push();
    p.translate(this.position.x * BLOCK_SIZE, this.position.y * BLOCK_SIZE);

    for (let block of this.blocks) {
      block.draw();
    }

    p.push();
    p.stroke(255, 0, 0);
    p.ellipse(0, 0, 5);
    p.ellipse(this.w * BLOCK_SIZE, this.h * BLOCK_SIZE, 5);
    p.pop();

    p.pop();
  }

  public move(where: EntityMove) {
    const newStartPosition = this.position.copy();

    switch (where) {
      case EntityMove.Up: {
        newStartPosition.y -= 1;
        break;
      }

      case EntityMove.Down: {
        newStartPosition.y += 1;
        break;
      }

      case EntityMove.Left: {
        newStartPosition.x -= 1;
        break;
      }

      case EntityMove.Right: {
        newStartPosition.x += 1;
        break;
      }
    }

    const newEndPosition = this.getEndVector(newStartPosition);

    // Validate move legality :)

    // Check within play area
    if (
      newStartPosition.x < 0 ||
      newEndPosition.x > this.engine.config.playArea.w
    ) {
      // trying to go horizontally out of the play area, no sir, not allowed sir.
      return EntityMoveResult.Invalid;
    }

    if (!this.canMoveIntoPosition(newStartPosition)) {
      console.log(this.id);
      return where === EntityMove.Down
        ? EntityMoveResult.ReachedBottom
        : EntityMoveResult.Invalid;
    }

    this.position.set(newStartPosition);

    return EntityMoveResult.Ok;
  }

  public canMoveIntoPosition(position: p5.Vector) {
    // i'm not sure if this is worth it, but this should ensure that
    //  this function keeps consistent timing regardless of the
    //  outcome.
    //
    // I.E Returning early would actually make block failures faster than
    //  block successes. Does it matter? I don't know, but lets keep it
    //  consistent just in case! :)
    let result = true;

    for (let block of this.blocks) {
      const bp = block.blockRelativeToPosition(position);

      if (this.engine.blockMatrix[bp.y]?.[bp.x]) {
        result = false;
      }

      if (bp.y >= this.engine.config.playArea.h) {
        result = false;
      }
    }

    return result;
  }

  public getEndVector(vector: p5.Vector = this.position): p5.Vector {
    const newVector = vector.copy();

    newVector.x += this.w;
    newVector.y += this.h;

    return newVector;
  }

  public collides(sv: p5.Vector, ev: p5.Vector) {
    const cp = this.position;
    const ep = this.getEndVector();

    return (
      (ev.x > cp.x && ev.y > cp.y && sv.x < ep.x && sv.y < ep.y) ||
      (sv.x > cp.x && sv.y > cp.y && ev.x < ep.x && ev.y < ep.y)
    );
  }
}
