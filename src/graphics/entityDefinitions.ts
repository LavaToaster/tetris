import p5 from 'p5';

export interface EntityDefinition {
  color: p5.Color;
  vectors: p5.Vector[];
  rotationVector: p5.Vector;
}

const colors = {
  red: [231, 111, 81],
  orange: [244, 162, 97],
  blue: [38, 70, 83],
  lightBlue: [42, 157, 143],
  yellow: [233, 196, 106],
  green: [138, 177, 125],
  purple: [47, 25, 97],
};

export type EntityNames =
  | 'lShape'
  | 'jShape'
  | 'oShape'
  | 'iShape'
  | 'zShape'
  | 'sShape'
  | 'tShape';

export const entityDefinitions: {
  [key in EntityNames]: (p: p5) => EntityDefinition;
} = {
  lShape: (p) => ({
    color: p.color(colors.orange),
    vectors: [
      p.createVector(0, 0), // []
      p.createVector(0, 1), //*[]
      p.createVector(0, 2), // [][]
      p.createVector(1, 2),
    ],
    rotationVector: p.createVector(0, 1),
  }),

  jShape: (p) => ({
    color: p.color(colors.blue),
    vectors: [
      p.createVector(1, 0), //   []
      p.createVector(1, 1), //   []*
      p.createVector(0, 2), // [][]
      p.createVector(1, 2),
    ],
    rotationVector: p.createVector(1, 1),
  }),

  oShape: (p) => ({
    color: p.color(colors.yellow),
    vectors: [
      p.createVector(0, 0), // [][]
      p.createVector(0, 1), // [][]
      p.createVector(1, 0),
      p.createVector(1, 1),
    ],
    rotationVector: p.createVector(0.5, 0.5),
  }),

  iShape: (p) => ({
    color: p.color(colors.lightBlue),
    vectors: [
      p.createVector(0, 0), // []
      p.createVector(0, 1), // []
      p.createVector(0, 2), // []
      p.createVector(0, 3), // []
    ],
    rotationVector: p.createVector(0.5, 1.5),
  }),

  zShape: (p) => ({
    color: p.color(colors.red),
    vectors: [
      p.createVector(0, 0), // [][]
      p.createVector(1, 0), //   [][]
      p.createVector(1, 1),
      p.createVector(2, 1),
    ],
    rotationVector: p.createVector(1, 1),
  }),

  sShape: (p) => ({
    color: p.color(colors.green),
    vectors: [
      p.createVector(1, 0), //   [][]
      p.createVector(2, 0), // [][]
      p.createVector(0, 1),
      p.createVector(1, 1),
    ],
    rotationVector: p.createVector(1, 1),
  }),

  tShape: (p) => ({
    color: p.color(colors.purple),
    vectors: [
      p.createVector(1, 0), //   []
      p.createVector(0, 1), // [][][]
      p.createVector(1, 1),
      p.createVector(2, 1),
    ],
    rotationVector: p.createVector(1, 1),
  }),
};
