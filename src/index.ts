import { Engine, EngineConfig } from './engine';

const config: EngineConfig = {
  playArea: {
    x: 10,
    y: 20,
  },
};

const tetris = new Engine(config);

(window as any).tetris = tetris;
tetris.run();
