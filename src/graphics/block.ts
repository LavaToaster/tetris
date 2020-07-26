import p5 from 'p5';
import { BLOCK_SIZE } from '../consts';
import type { Entity } from './entity';
import { randomInt } from '../util';

export class Block {
  public id: number;

  constructor(
    private p: p5,
    private entity: Entity,
    private position: p5.Vector,
    private color: p5.Color,
  ) {
    this.id = randomInt(0, 100);
  }

  public draw() {
    const p = this.p;

    p.push();
    p.fill(this.color);
    p.stroke(0);
    p.strokeWeight(2);
    p.rect(
      this.position.x * BLOCK_SIZE,
      this.position.y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE,
    );

    p.fill(255);
    p.text(
      this.id,
      this.position.x * BLOCK_SIZE + p.textSize(),
      this.position.y * BLOCK_SIZE + p.textSize(),
    );

    p.pop();
  }

  public realVector(entityPosition: p5.Vector = this.entity.position) {
    const entityPositionX = entityPosition.x * BLOCK_SIZE;
    const entityPositionY = entityPosition.y * BLOCK_SIZE;
    const blockPositionX = this.position.x * BLOCK_SIZE;
    const blockPositionY = this.position.y * BLOCK_SIZE;

    return this.p.createVector(
      entityPositionX + blockPositionX,
      entityPositionY + blockPositionY,
    );
  }
}
