import { Engine, EngineConfig } from './engine';

const config: EngineConfig = {
  playArea: {
    w: 10,
    h: 20,
  },
};

const tetris = new Engine(config);

(window as any).tetris = tetris;
tetris.run();
