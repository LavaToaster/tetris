import p5 from 'p5';
import { Entity, EntityMove, EntityMoveResult } from './graphics/entity';
import { entityDefinitions } from './graphics/entityDefinitions';
import { BLOCK_SIZE } from './consts';
import { randomInt } from './util';

export interface EngineConfig {
  playArea: {
    x: number;
    y: number;
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

  constructor(public config: EngineConfig) {
    // const uiMinimumWidth = 704;
    const uiMinimumWidth = 512;
    const uiMinimumHeight = 512;

    const width = uiMinimumWidth + config.playArea.x * BLOCK_SIZE;
    let height = config.playArea.y * BLOCK_SIZE;

    if (height < uiMinimumHeight) {
      height = uiMinimumHeight;
    }

    const playX1 = Math.floor(width / 2 - (config.playArea.x * BLOCK_SIZE) / 2);
    const playX2 = width - playX1;

    const playY1 = 0; // Idk, but this is here for maybe future use?
    const playY2 = config.playArea.y * BLOCK_SIZE;

    this.bounds = {
      width,
      height,
      playX1,
      playX2,
      playY1,
      playY2,
    };

    this.backgroundLayerSketch = new p5(this.createBackgroundLayer);
    this.gameLayerSketch = new p5(this.createGameLayer);
  }

  createGameLayer = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(this.bounds.width, this.bounds.height);
      canvas.parent('#root');
      canvas.id('game-layer');

      this.createNewEntity();
    };

    p.draw = () => {
      p.clear();
      p.translate(this.bounds.playX1, 0);

      if (this.currentEntity) {
        this.currentEntity.draw();
      }

      for (let entity of this.entities) {
        entity.draw();
      }
    };
  };

  createNewEntity() {
    if (this.currentEntity) {
      this.entities.push(this.currentEntity);
    }

    const entity = new Entity(
      this,
      this.getRandomEntityDefinition(),
      this.gameLayerSketch.createVector(0, 0),
    );

    entity.position.x = randomInt(0, this.config.playArea.x - entity.w);

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
      for (let i = 0; i <= this.config.playArea.x; i++) {
        const position = i * BLOCK_SIZE + this.bounds.playX1;
        p.line(position, this.bounds.playY1, position, this.bounds.playY2);
      }

      // horizontal lines
      for (let j = 0; j < this.config.playArea.y + 1; j++) {
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
    window.setInterval(this.tick, 200);
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
        this.createNewEntity();
      }
    });
  }

  tick = () => {
    this.moveActive(EntityMove.Down);
    this.keepAlive = false;

    // for (let entity of this.entities) {
    //   entity.move(EntityMove.Down);
    // }
  };

  moveActive(where: EntityMove) {
    let result = this.currentEntity!.move(where);

    if (result === EntityMoveResult.ReachedBottom && !this.keepAlive) {
      this.createNewEntity();
    }

    // console.log(result);
  }

  getRandomEntityDefinition() {
    const keys = Object.keys(entityDefinitions);
    return entityDefinitions[keys[(keys.length * Math.random()) << 0]](
      this.gameLayerSketch,
    );
  }
}
