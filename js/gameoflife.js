function seed(...args) {
  return args;
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

function contains(cell) {
  const isSame = tc => same(cell, tc);
  return this.some(isSame);
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ?
    '\u25A3' :
    '\u25A2'
};

const corners = (state = []) => {
  return state.reduce((acc, [x, y]) => {
    return {
      bottomLeft: [
        Math.min(x, acc.bottomLeft[0] || x),
        Math.min(y, acc.bottomLeft[1] || y)
      ],
      topRight: [
        Math.max(x, acc.topRight[0] || x),
        Math.max(y, acc.topRight[1] || y)
      ],
    };
  }, {topRight: [0, 0], bottomLeft: [0, 0]});
};

function range(startAt, endAt) {
  const size = endAt - startAt + 1;
  return [...Array(size).keys()].map(i => i + startAt);
}

const printCells = (state) => {
  const [xStart, yStart, xFinal, yFinal] = Object.values(corners(state)).flat();

  return range(yStart, yFinal).map(y =>
    range(xStart, xFinal).map(x =>
      printCell([x, y], state)).join(" ")
  ).reverse().join("\n");
};

const getNeighborsOf = ([x, y]) => {
  return range(y - 1, y + 1).map(yy =>
    range(x - 1, x + 1).map(xx =>
      [xx, yy]))
    .flat()
    .filter(i => !same([x, y], i));
};

const getLivingNeighbors = (cell, state) =>
  getNeighborsOf(cell).filter(contains.bind(state));

const willBeAlive = (cell, state) => {
  const isAlive = contains.call(state, cell);
  const livingNeighborsCount = getLivingNeighbors(cell, state).length;

  return (isAlive && livingNeighborsCount === 2) || livingNeighborsCount === 3;
};

const calculateNext = (state) => {
  const [xStart, yStart, xFinal, yFinal] = Object.values(corners(state)).flat();

  return range(yStart - 1, yFinal + 1)
    .map(yy => range(xStart - 1, xFinal + 1)
      .map(xx => [xx, yy]))
    .flat()
    .filter(cell => willBeAlive(cell, state));
};

const iterate = (state, iterations) => {
  let currState = state;
  return [state].concat(
    range(1, iterations).map(() => {
      return currState = calculateNext(currState);
    }));
};

const main = (pattern, iterations) => {
  const game = startPatterns[pattern];
  const games = iterate(game, iterations).map(printCells);

  games.forEach(g => console.log(g + '\n'));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
