import p5 from 'p5';
import { BLOCK_SIZE } from '../consts';
import { randomInt } from '../util';

export class Block {
  public id: number;

  constructor(
    private p: p5,
    public position: p5.Vector,
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

    // p.fill(255);
    // p.text(
    //   this.id,
    //   this.position.x * BLOCK_SIZE + p.textSize(),
    //   this.position.y * BLOCK_SIZE + p.textSize(),
    // );

    p.pop();
  }

  public moveDown(blockMatrix: Block[][], amount: number) {
    const previousY = this.position.y;

    this.position.y += amount;

    delete blockMatrix[previousY][this.position.x];
    blockMatrix[this.position.y][this.position.x] = this;
  }

  public blockRelativeToPosition(entityPosition: p5.Vector) {
    const entityPositionX = entityPosition.x;
    const entityPositionY = entityPosition.y;
    const blockPositionX = this.position.x;
    const blockPositionY = this.position.y;

    return this.p.createVector(
      entityPositionX + blockPositionX,
      entityPositionY + blockPositionY,
    );
  }
}
