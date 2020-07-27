import p5 from 'p5';
import { Entity, EntityMove, EntityMoveResult } from './graphics/entity';
import { entityDefinitions } from './graphics/entityDefinitions';
import { BLOCK_SIZE } from './consts';
import { randomInt } from './util';
import { Block } from './graphics/block';

export interface EngineConfig {
  playArea: {
    w: number;
    h: number;
  };
}

export interface Bounds {
  width: number;
  height: number;

  playX1: number;
  playX2: number;

  playY1: number;
  playY2: number;
}

export class Engine {
  public gameLayerSketch: p5;
  public backgroundLayerSketch: p5;
  public bounds: Bounds;
  public keepAlive = false;

  private currentEntity?: Entity;
  public entities: Entity[] = [];
  public blockMatrix: Block[][] = [];
  private gameTimer?: number;

  constructor(public config: EngineConfig) {
    // const uiMinimumWidth = 704;
    const uiMinimumWidth = 512;
    const uiMinimumHeight = 512;

    const width = uiMinimumWidth + config.playArea.w * BLOCK_SIZE;
    let height = config.playArea.h * BLOCK_SIZE;

    if (height < uiMinimumHeight) {
      height = uiMinimumHeight;
    }

    const playX1 = Math.floor(width / 2 - (config.playArea.w * BLOCK_SIZE) / 2);
    const playX2 = width - playX1;

    const playY1 = 0; // Idk, but this is here for maybe future use?
    const playY2 = config.playArea.h * BLOCK_SIZE;

    this.bounds = {
      width,
      height,
      playX1,
      playX2,
      playY1,
      playY2,
    };

    this.tick = this.tick.bind(this);

    this.backgroundLayerSketch = new p5(this.createBackgroundLayer);
    this.gameLayerSketch = new p5(this.createGameLayer);
  }

  createGameLayer = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(this.bounds.width, this.bounds.height);
      canvas.parent('#root');
      canvas.id('game-layer');

      this.spawnEntity();
    };

    p.draw = () => {
      p.clear();
      p.translate(this.bounds.playX1, 0);

      for (let row of this.blockMatrix) {
        for (let block of row ?? []) {
          block?.draw();
        }
      }

      if (this.currentEntity) {
        this.currentEntity.draw();
      }
    };
  };

  spawnEntity() {
    if (this.currentEntity) {
      for (let block of this.currentEntity.blocks) {
        const vector = block.blockRelativeToPosition(
          this.currentEntity.position,
        );
        block.position.set(vector);

        if (!this.blockMatrix[vector.y]) {
          this.blockMatrix[vector.y] = [];
        }

        this.blockMatrix[vector.y][vector.x] = block;
      }

      console.log(this.blockMatrix);
    }

    const entity = new Entity(
      this,
      this.getRandomEntityDefinition(),
      this.gameLayerSketch.createVector(0, 0),
    );

    entity.position.y = entity.h * -1;
    entity.position.x = randomInt(0, this.config.playArea.w - entity.w);

    this.currentEntity = entity;
  }

  createBackgroundLayer = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(this.bounds.width, this.bounds.height);
      canvas.parent('#root');
      canvas.id('background-layer');

      p.noLoop();
    };

    p.draw = () => {
      p.stroke(200);

      // canvas border
      p.strokeWeight(2);
      p.rect(0, 0, p.width, p.height);

      // game area grid
      p.strokeWeight(1);

      // vertical lines
      for (let i = 0; i <= this.config.playArea.w; i++) {
        const position = i * BLOCK_SIZE + this.bounds.playX1;
        p.line(position, this.bounds.playY1, position, this.bounds.playY2);
      }

      // horizontal lines
      for (let j = 0; j < this.config.playArea.h + 1; j++) {
        p.line(
          this.bounds.playX1,
          j * BLOCK_SIZE,
          this.bounds.playX2,
          j * BLOCK_SIZE,
        );
      }
    };
  };

  run() {
    this.bindKeyboardListeners();
    this.gameTimer = window.setInterval(this.tick, 200);
  }

  bindKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        this.tick();
      }

      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        this.keepAlive = true;
        this.moveActive(EntityMove.Right);
      }

      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        this.keepAlive = true;
        this.moveActive(EntityMove.Left);
      }

      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        this.moveActive(EntityMove.Up);
      }

      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.moveActive(EntityMove.Down);
      }

      if (e.code === 'Space') {
        this.spawnEntity();
      }
    });
  }

  tick() {
    this.moveActive(EntityMove.Down);
    this.keepAlive = false;
    let moveDown = 0;

    for (let idx = this.config.playArea.h - 1; idx >= 0; idx--) {
      let row = this.blockMatrix[idx];
      let blocks = row?.filter((i) => Boolean(i)) ?? [];

      if (moveDown > 0 && blocks.length > 0) {
        for (let block of blocks) {
          block.moveDown(this.blockMatrix, moveDown);
        }

        console.log('moving time', moveDown);

        idx = idx + moveDown;
        row = this.blockMatrix[idx];
        blocks = row?.filter((i) => Boolean(i)) ?? [];
      }

      // we have a hit?
      if (blocks.length === this.config.playArea.w) {
        this.blockMatrix[idx].length = 0;
        this.blockMatrix[idx].length = this.config.playArea.w;
        moveDown++;
      }
    }

    // for (let entity of this.entities) {
    //   entity.move(EntityMove.Down);
    // }
  }

  moveActive(where: EntityMove) {
    let result = this.currentEntity!.move(where);

    if (result === EntityMoveResult.ReachedBottom && !this.keepAlive) {
      if (this.currentEntity!.position.y < 0) {
        console.log(this.blockMatrix, this.currentEntity?.position);

        window.clearInterval(this.gameTimer);
        window.alert('Ya dead!');
        return;
      }

      this.spawnEntity();
    }
  }

  getRandomEntityDefinition() {
    const keys = Object.keys(entityDefinitions);
    return entityDefinitions[keys[(keys.length * Math.random()) << 0]](
      this.gameLayerSketch,
    );
  }
}
